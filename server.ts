import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CATEGORIES_DATA, PRODUCTS_DATA, COUPONS_DATA, DELIVERY_ZONES_DATA, SAMPLE_USERS, INITIAL_ORDERS } from './src/data/seedData.ts';
import { Product, Order, User, Category, Coupon, DeliveryZone, OrderStatus, SupportTicket } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-Memory Database Structure with disk persistence
interface DBStore {
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  deliveryZones: DeliveryZone[];
  users: User[];
  orders: Order[];
  tickets: SupportTicket[];
}

let db: DBStore = {
  categories: [...CATEGORIES_DATA],
  products: [...PRODUCTS_DATA],
  coupons: [...COUPONS_DATA],
  deliveryZones: [...DELIVERY_ZONES_DATA],
  users: [...SAMPLE_USERS],
  orders: [...INITIAL_ORDERS],
  tickets: [
    {
      id: 't-101',
      ticketNumber: 'TKT-2026-101',
      userId: 'user-cust-1',
      userName: 'Tanvir Ahmed',
      userPhone: '01711223344',
      subject: 'Inquiry regarding 1-hour express delivery coverage',
      category: 'delivery',
      message: 'Hello, do you deliver within 60 minutes in Dhanmondi Road 7/A during rush hours?',
      status: 'Resolved',
      createdAt: '2026-10-29T10:00:00Z',
      replies: [
        {
          sender: 'agent',
          text: 'Hello Mr. Tanvir! Yes, our Dhanmondi fulfillment hub guarantees 60-minute express grocery delivery for Dhanmondi, Kalabagan, and Lalmatia.',
          timestamp: '2026-10-29T10:15:00Z'
        }
      ]
    }
  ]
};

// Initialize persistent DB if exists, or write default seed
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.products.length >= 280) {
        db = parsed;
        if (db.users) {
          db.users.forEach((u: any) => { delete u.avatarUrl; });
        }
        console.log(`[DB] Loaded ${db.products.length} products, ${db.orders.length} orders from persistent store.`);
        return;
      } else {
        // Upgrade to complete catalog
        db = {
          ...parsed,
          products: [...PRODUCTS_DATA],
          categories: [...CATEGORIES_DATA]
        };
        saveDatabase();
        console.log(`[DB] Upgraded database to ${db.products.length} products.`);
        return;
      }
    }
    saveDatabase();
  } catch (err) {
    console.error('[DB] Failed to load database, using memory store:', err);
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist db:', err);
  }
}

loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Router prefix: /api
  // 1. Categories
  app.get('/api/categories', (req: Request, res: Response) => {
    // Recalculate item count
    const withCounts = db.categories.map(cat => ({
      ...cat,
      itemCount: db.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
    res.json({ success: true, data: withCounts });
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const { name, nameBn, slug, icon, description, featuredImage, subcategories } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug required' });
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      nameBn: nameBn || name,
      slug,
      icon: icon || 'ShoppingBag',
      description: description || '',
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
      subcategories: subcategories || []
    };
    db.categories.push(newCat);
    saveDatabase();
    res.status(201).json({ success: true, data: newCat });
  });

  // 2. Products
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...db.products];
    const { search, category, subcategory, brand, minPrice, maxPrice, inStock, flashDeals, featured, sort, limit, page } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase() || p.category.includes(category));
    }

    if (subcategory && typeof subcategory === 'string' && subcategory !== 'All') {
      result = result.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    if (brand && typeof brand === 'string' && brand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (minPrice) {
      result = result.filter(p => (p.discountPrice || p.regularPrice) >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => (p.discountPrice || p.regularPrice) <= Number(maxPrice));
    }

    if (inStock === 'true') {
      result = result.filter(p => p.stockQuantity > 0);
    }

    if (flashDeals === 'true') {
      result = result.filter(p => p.isFlashDeal);
    }

    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => (a.discountPrice || a.regularPrice) - (b.discountPrice || b.regularPrice));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b.discountPrice || b.regularPrice) - (a.discountPrice || a.regularPrice));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => {
        const discA = a.discountPrice ? (a.regularPrice - a.discountPrice) / a.regularPrice : 0;
        const discB = b.discountPrice ? (b.regularPrice - b.discountPrice) / b.regularPrice : 0;
        return discB - discA;
      });
    } else {
      // Default: popularity / featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = result.length;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const p = db.products.find(item => item.id === req.params.id || item.slug === req.params.id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const related = db.products
      .filter(item => item.id !== p.id && item.category === p.category)
      .slice(0, 4);

    res.json({ success: true, data: p, related });
  });

  app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { userId, userName, rating, comment } = req.body;
    const p = db.products.find(item => item.id === req.params.id);
    if (!p) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const newReview = {
      id: `r-${Date.now()}`,
      userId: userId || 'anon',
      userName: userName || 'Valued Customer',
      rating: Number(rating) || 5,
      comment: comment || '',
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true
    };
    if (!p.reviews) p.reviews = [];
    p.reviews.unshift(newReview);
    p.reviewCount = p.reviews.length;
    p.rating = Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1));
    saveDatabase();
    res.status(201).json({ success: true, data: newReview, productRating: p.rating, reviewCount: p.reviewCount });
  });

  // Admin Product Management
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: req.body.sku || `SM-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: req.body.name,
      nameBn: req.body.nameBn || req.body.name,
      category: req.body.category || 'Grocery & Daily Essentials',
      subcategory: req.body.subcategory || 'General',
      brand: req.body.brand || 'Super Mart',
      regularPrice: Number(req.body.regularPrice) || 100,
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : undefined,
      stockQuantity: Number(req.body.stockQuantity) || 50,
      unit: req.body.unit || '1 pc',
      weight: req.body.weight || '1 kg',
      images: req.body.images && req.body.images.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
      description: req.body.description || '',
      descriptionBn: req.body.descriptionBn || '',
      specifications: req.body.specifications || {},
      isPerishable: Boolean(req.body.isPerishable),
      expiryDate: req.body.expiryDate || undefined,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      isFeatured: Boolean(req.body.isFeatured),
      isFlashDeal: Boolean(req.body.isFlashDeal),
      badge: req.body.badge || (req.body.discountPrice ? 'Special' : 'New')
    };
    db.products.unshift(newProduct);
    saveDatabase();
    res.status(201).json({ success: true, data: newProduct });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    db.products[idx] = {
      ...db.products[idx],
      ...req.body,
      id: db.products[idx].id
    };
    saveDatabase();
    res.json({ success: true, data: db.products[idx] });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const deleted = db.products.splice(idx, 1);
    saveDatabase();
    res.json({ success: true, data: deleted[0] });
  });

  // 3. Coupons
  app.get('/api/coupons', (req: Request, res: Response) => {
    res.json({ success: true, data: db.coupons });
  });

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid promo code' });
    }
    const total = Number(cartTotal) || 0;
    if (total < coupon.minSpend) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ৳${coupon.minSpend} required for coupon ${coupon.code}`
      });
    }

    let discount = 0;
    if (coupon.discountFlat) {
      discount = coupon.discountFlat;
    } else if (coupon.discountPercent) {
      discount = (total * coupon.discountPercent) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount: Math.round(discount),
        description: coupon.description,
        descriptionBn: coupon.descriptionBn
      }
    });
  });

  // 4. Delivery Zones
  app.get('/api/delivery-zones', (req: Request, res: Response) => {
    res.json({ success: true, data: db.deliveryZones });
  });

  // 5. Orders & Checkout
  app.get('/api/orders', (req: Request, res: Response) => {
    const { userId, status, limit } = req.query;
    let list = [...db.orders];
    if (userId && typeof userId === 'string') {
      list = list.filter(o => o.userId === userId);
    }
    if (status && typeof status === 'string' && status !== 'All') {
      list = list.filter(o => o.status === status);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (limit) {
      list = list.slice(0, Number(limit));
    }
    res.json({ success: true, data: list });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      deliverySlot,
      deliveryNotes,
      subtotal,
      discountAmount,
      couponCode,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      senderPhone,
      transactionId
    } = req.body;

    if (!items || !items.length || !shippingAddress || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Incomplete order payload' });
    }

    // Verify and adjust inventory stock
    for (const item of items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      }
    }

    const orderNum = `SM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const isPaidOnline = ['bKash', 'Nagad', 'Rocket', 'Card'].includes(paymentMethod);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: userId || 'user-cust-1',
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@supermart.bd',
      customerPhone: customerPhone || '01700000000',
      items,
      shippingAddress,
      deliverySlot: deliverySlot || 'Express (Within 60 Mins)',
      deliveryNotes: deliveryNotes || '',
      subtotal: Number(subtotal),
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || undefined,
      deliveryFee: Number(deliveryFee) || 50,
      tax: Number(tax) || 0,
      totalAmount: Number(totalAmount),
      payment: {
        method: paymentMethod || 'COD',
        status: isPaidOnline ? 'Paid' : 'Pending',
        senderPhone: senderPhone || undefined,
        transactionId: transactionId || (isPaidOnline ? `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}` : undefined),
        paidAt: isPaidOnline ? nowIso : undefined,
        amount: Number(totalAmount)
      },
      status: 'Confirmed',
      assignedDeliveryAgentId: 'user-agent-1',
      assignedDeliveryAgentName: 'Sojib Hasan (Rider #104)',
      assignedDeliveryAgentPhone: '01677334455',
      timeline: [
        { status: 'Pending', timestamp: nowIso, note: `Order placed via ${paymentMethod}`, completed: true },
        { status: 'Confirmed', timestamp: nowIso, note: 'Order accepted by Super Mart automated dispatch system', completed: true },
        { status: 'Processing', timestamp: '', note: 'Packing goods at nearest local fulfillment hub', completed: false },
        { status: 'Out for Delivery', timestamp: '', note: 'Assigned to Rider Sojib Hasan', completed: false },
        { status: 'Delivered', timestamp: '', note: 'Order handed over to customer', completed: false }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Award loyalty points (1 point per ৳20 spent)
    const user = db.users.find(u => u.id === (userId || 'user-cust-1'));
    if (user) {
      user.loyaltyPoints += Math.floor(totalAmount / 20);
    }

    db.orders.unshift(newOrder);
    saveDatabase();

    res.status(201).json({ success: true, data: newOrder });
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note } = req.body;
    const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const validStatuses: OrderStatus[] = [
      'Pending', 'Confirmed', 'Processing', 'Packed', 'Ready for Shipment',
      'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    // If marked delivered, update payment status if COD
    if (status === 'Delivered' && order.payment.method === 'COD') {
      order.payment.status = 'Paid';
      order.payment.paidAt = new Date().toISOString();
    }

    // Add to timeline
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status}`,
      completed: true
    });

    saveDatabase();
    res.json({ success: true, data: order });
  });

  app.patch('/api/orders/:id/assign', (req: Request, res: Response) => {
    const { agentId, agentName, agentPhone } = req.body;
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.assignedDeliveryAgentId = agentId;
    order.assignedDeliveryAgentName = agentName;
    order.assignedDeliveryAgentPhone = agentPhone;
    order.updatedAt = new Date().toISOString();
    saveDatabase();
    res.json({ success: true, data: order });
  });

  // 6. Auth & User Profile
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { emailOrPhone, role } = req.body;
    // Allow quick 1-click switch or credentials
    let user = db.users.find(u =>
      (emailOrPhone && (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone)) ||
      (role && u.role === role)
    );
    if (!user) {
      // Default to customer
      user = db.users[0];
    }
    res.json({
      success: true,
      token: `sm_jwt_${user.id}_${Date.now()}`,
      data: user
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Name and email or phone required' });
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email || `${phone}@supermart.bd`,
      phone: phone || '01700000000',
      role: role || 'customer',
      loyaltyPoints: 50, // Welcome points
      createdAt: new Date().toISOString(),
      addresses: []
    };
    db.users.push(newUser);
    saveDatabase();
    res.status(201).json({
      success: true,
      token: `sm_jwt_${newUser.id}_${Date.now()}`,
      data: newUser
    });
  });

  app.get('/api/auth/users', (req: Request, res: Response) => {
    res.json({ success: true, data: db.users });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const { userId, name, phone, addresses } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;
    saveDatabase();
    res.json({ success: true, data: user });
  });

  // 7. Inventory & Restock
  app.get('/api/inventory', (req: Request, res: Response) => {
    const lowStockThreshold = 25;
    const lowStockItems = db.products.filter(p => p.stockQuantity <= lowStockThreshold);
    const outOfStockItems = db.products.filter(p => p.stockQuantity === 0);
    const perishableItems = db.products.filter(p => p.isPerishable && p.expiryDate);

    res.json({
      success: true,
      data: {
        totalProducts: db.products.length,
        lowStockItems,
        outOfStockItems,
        perishableItems,
        items: db.products.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          stock: p.stockQuantity,
          regularPrice: p.regularPrice,
          discountPrice: p.discountPrice,
          isPerishable: p.isPerishable,
          expiryDate: p.expiryDate
        }))
      }
    });
  });

  app.post('/api/inventory/restock', (req: Request, res: Response) => {
    const { productId, addedQuantity, costPrice, supplier } = req.body;
    const product = db.products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.stockQuantity += Number(addedQuantity) || 10;
    saveDatabase();
    res.json({
      success: true,
      message: `Restocked ${product.name} with ${addedQuantity} units`,
      currentStock: product.stockQuantity
    });
  });

  // 8. Admin Analytics & KPI
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const totalOrders = db.orders.length;
    const totalRevenue = db.orders.reduce((acc, o) => acc + (o.payment.status === 'Paid' ? o.totalAmount : o.totalAmount), 0);
    const pendingOrders = db.orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
    const deliveredOrders = db.orders.filter(o => o.status === 'Delivered').length;
    const lowStockCount = db.products.filter(p => p.stockQuantity < 25).length;
    const totalCustomers = db.users.filter(u => u.role === 'customer').length;

    // Category sales distribution
    const categoryCounts: Record<string, number> = {};
    for (const o of db.orders) {
      for (const item of o.items) {
        const prod = db.products.find(p => p.id === item.productId);
        const catName = prod ? prod.category : 'Grocery';
        categoryCounts[catName] = (categoryCounts[catName] || 0) + item.totalPrice;
      }
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalCustomers: Math.max(totalCustomers, 142),
        totalProducts: db.products.length,
        lowStockCount,
        categorySales: categoryCounts,
        recentOrders: db.orders.slice(0, 8)
      }
    });
  });

  // 9. Customer Support Tickets
  app.get('/api/support/tickets', (req: Request, res: Response) => {
    res.json({ success: true, data: db.tickets });
  });

  app.post('/api/support/tickets', (req: Request, res: Response) => {
    const { userId, userName, userPhone, subject, category, message } = req.body;
    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: userId || 'user-cust-1',
      userName: userName || 'Customer',
      userPhone: userPhone || '',
      subject: subject || 'General Inquiry',
      category: category || 'general',
      message: message || '',
      status: 'Open',
      createdAt: new Date().toISOString(),
      replies: []
    };
    db.tickets.unshift(newTicket);
    saveDatabase();
    res.status(201).json({ success: true, data: newTicket });
  });

  app.post('/api/support/tickets/:id/reply', (req: Request, res: Response) => {
    const { sender, text } = req.body;
    const t = db.tickets.find(item => item.id === req.params.id);
    if (!t) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    t.replies.push({
      sender: sender || 'agent',
      text: text || '',
      timestamp: new Date().toISOString()
    });
    if (sender === 'agent') {
      t.status = 'In Progress';
    }
    saveDatabase();
    res.json({ success: true, data: t });
  });

  // Setup Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SUPER MART] Server active and running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
