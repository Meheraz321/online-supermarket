import { Category, Product, Coupon, DeliveryZone, User, Order } from '../types';
import { FULL_SUPERMARKET_CATALOG } from './productsCatalog';

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-grocery',
    name: 'Grocery & Daily Essentials',
    nameBn: 'মুদি ও নিত্যপণ্য',
    slug: 'grocery-essentials',
    icon: 'ShoppingBag',
    description: 'Rice, oil, spices, lentils, sugar, salt, flour and daily cooking staples',
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    itemCount: 120,
    subcategories: [
      { id: 'sub-rice', name: 'Rice & Grains', nameBn: 'চাল ও দানাশস্য', slug: 'rice' },
      { id: 'sub-oil', name: 'Cooking Oil & Ghee', nameBn: 'ভোজ্য তেল ও ঘি', slug: 'oil' },
      { id: 'sub-dal', name: 'Lentils & Pulses', nameBn: 'ডাল ও শিম', slug: 'lentils' },
      { id: 'sub-flour', name: 'Flour & Atta', nameBn: 'আটা ও ময়দা', slug: 'flour' },
      { id: 'sub-spices', name: 'Spices & Seasoning', nameBn: 'মসলাপাতি', slug: 'spices' },
      { id: 'sub-noodles', name: 'Noodles & Pasta', nameBn: 'নুডুলস ও পাস্তা', slug: 'noodles' },
      { id: 'sub-canned', name: 'Canned Food & Pickles', nameBn: 'টিনজাত খাদ্য ও আচার', slug: 'canned' },
      { id: 'sub-tea', name: 'Tea & Coffee Essentials', nameBn: 'চা ও কফি', slug: 'tea-coffee' }
    ]
  },
  {
    id: 'cat-fruits-veg',
    name: 'Fruits & Vegetables',
    nameBn: 'তাজা ফল ও শাকসবজি',
    slug: 'fruits-vegetables',
    icon: 'Apple',
    description: 'Farm-fresh local and imported fruits, seasonal greens and organic vegetables',
    featuredImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    itemCount: 65,
    subcategories: [
      { id: 'sub-fresh-fruits', name: 'Fresh Fruits', nameBn: 'তাজা ফলমূল', slug: 'fresh-fruits' },
      { id: 'sub-fresh-veg', name: 'Fresh Vegetables', nameBn: 'সবজি', slug: 'fresh-veg' },
      { id: 'sub-leafy', name: 'Leafy Greens', nameBn: 'শাকসবজি', slug: 'leafy-greens' },
      { id: 'sub-organic', name: 'Organic Produce', nameBn: 'অর্গানিক পণ্য', slug: 'organic' },
      { id: 'sub-imported-fruits', name: 'Imported Fruits', nameBn: 'আমদানিকৃত ফল', slug: 'imported-fruits' }
    ]
  },
  {
    id: 'cat-meat-fish',
    name: 'Meat & Seafood',
    nameBn: 'মাছ ও মাংস',
    slug: 'meat-seafood',
    icon: 'Fish',
    description: '100% Halal fresh cuts of chicken, beef, mutton, Padma Hilsa and live fish',
    featuredImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    itemCount: 45,
    subcategories: [
      { id: 'sub-chicken', name: 'Chicken & Poultry', nameBn: 'মুরগি ও হাঁস', slug: 'chicken' },
      { id: 'sub-beef', name: 'Beef & Veal', nameBn: 'গরুর মাংস', slug: 'beef' },
      { id: 'sub-mutton', name: 'Mutton & Lamb', nameBn: 'খাসির মাংস', slug: 'mutton' },
      { id: 'sub-fish', name: 'Fresh Water Fish', nameBn: 'নদীর মাছ', slug: 'fish' },
      { id: 'sub-shrimp', name: 'Shrimp & Prawns', nameBn: 'চিংড়ি', slug: 'shrimp' },
      { id: 'sub-eggs', name: 'Farm Eggs', nameBn: 'ডিম', slug: 'eggs' }
    ]
  },
  {
    id: 'cat-dairy-bakery',
    name: 'Dairy & Bakery',
    nameBn: 'দুধ ও বেকারি পণ্য',
    slug: 'dairy-bakery',
    icon: 'Milk',
    description: 'Pasteurized milk, artisan cheese, farm butter, sweet yogurt and freshly baked bread',
    featuredImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    itemCount: 55,
    subcategories: [
      { id: 'sub-milk', name: 'Milk & Cream', nameBn: 'দুধ ও ক্রিম', slug: 'milk' },
      { id: 'sub-butter-cheese', name: 'Butter & Cheese', nameBn: 'মাখন ও পনির', slug: 'butter-cheese' },
      { id: 'sub-yogurt', name: 'Yogurt & Curd', nameBn: 'দই ও মিষ্টি দই', slug: 'yogurt' },
      { id: 'sub-bread', name: 'Bread & Buns', nameBn: 'পাউরুটি ও বান', slug: 'bread' },
      { id: 'sub-cakes', name: 'Cakes & Pastries', nameBn: 'কেক ও পেস্ট্রি', slug: 'cakes' },
      { id: 'sub-biscuits', name: 'Cookies & Biscuits', nameBn: 'বিস্কুট ও কুকিজ', slug: 'biscuits' }
    ]
  },
  {
    id: 'cat-beverages',
    name: 'Beverages & Juices',
    nameBn: 'পানীয় ও জুস',
    slug: 'beverages',
    icon: 'Coffee',
    description: 'Cold sodas, real fruit juices, mineral water, energy drinks and iced tea',
    featuredImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    itemCount: 40,
    subcategories: [
      { id: 'sub-soft-drinks', name: 'Soft Drinks', nameBn: 'কোমল পানীয়', slug: 'soft-drinks' },
      { id: 'sub-juice', name: 'Natural Fruit Juices', nameBn: 'ফলের জুস', slug: 'juices' },
      { id: 'sub-water', name: 'Mineral Water', nameBn: 'খাবার পানি', slug: 'water' },
      { id: 'sub-energy', name: 'Energy & Health Drinks', nameBn: 'এনার্জি ড্রিংকস', slug: 'energy-drinks' }
    ]
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    nameBn: 'ইলেকট্রনিক্স ও গ্যাজেটস',
    slug: 'electronics',
    icon: 'Smartphone',
    description: 'Smartphones, audio, smart watches, power banks, computer accessories & kitchen appliances',
    featuredImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    itemCount: 75,
    subcategories: [
      { id: 'sub-smartphones', name: 'Smartphones', nameBn: 'স্মার্টফোন', slug: 'smartphones' },
      { id: 'sub-audio', name: 'Headphones & Speakers', nameBn: 'হেডফোন ও স্পিকার', slug: 'audio' },
      { id: 'sub-smartwatch', name: 'Smart Watches', nameBn: 'স্মার্ট ঘড়ি', slug: 'smartwatch' },
      { id: 'sub-appliances', name: 'Home Appliances', nameBn: 'হোম অ্যাপ্লায়েন্স', slug: 'appliances' },
      { id: 'sub-chargers', name: 'Cables & Chargers', nameBn: 'চার্জার ও ক্যাবল', slug: 'chargers' }
    ]
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Clothing',
    nameBn: 'ফ্যাশন ও পোশাক',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Trendy Panjabis, shirts, Sarees, Kurtis, kids wear, footwear and watches',
    featuredImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    itemCount: 90,
    subcategories: [
      { id: 'sub-men', name: "Men's Collection", nameBn: 'পুরুষদের কালেকশন', slug: 'men' },
      { id: 'sub-women', name: "Women's Collection", nameBn: 'নারীদের কালেকশন', slug: 'women' },
      { id: 'sub-kids', name: "Kids' Wear", nameBn: 'বাচ্চাদের পোশাক', slug: 'kids' },
      { id: 'sub-shoes', name: 'Footwear & Bags', nameBn: 'জুতো ও ব্যাগ', slug: 'shoes-bags' }
    ]
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Personal Care',
    nameBn: 'সৌন্দর্য ও প্রসাধন',
    slug: 'beauty-personal-care',
    icon: 'Sparkles',
    description: 'Authentic skincare, haircare, body wash, oral hygiene and luxury perfumes',
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: 80,
    subcategories: [
      { id: 'sub-skincare', name: 'Skincare', nameBn: 'ত্বকের যত্ন', slug: 'skincare' },
      { id: 'sub-haircare', name: 'Haircare', nameBn: 'চুলের যত্ন', slug: 'haircare' },
      { id: 'sub-oral', name: 'Oral Care', nameBn: 'দাঁতের যত্ন', slug: 'oral-care' },
      { id: 'sub-bath', name: 'Bath & Body Care', nameBn: 'বডি ওয়াশ ও সাবান', slug: 'bath-body' }
    ]
  },
  {
    id: 'cat-home-kitchen',
    name: 'Home & Kitchen',
    nameBn: 'গৃহস্থালি ও কিচেন',
    slug: 'home-kitchen',
    icon: 'Home',
    description: 'Cookware, dinner sets, kitchen gadgets, cleaning supplies and home decor',
    featuredImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    itemCount: 60,
    subcategories: [
      { id: 'sub-cookware', name: 'Pans & Cookware', nameBn: 'রান্নার তৈজসপত্র', slug: 'cookware' },
      { id: 'sub-cleaning', name: 'Cleaning & Detergents', nameBn: 'ক্লিনিং সামগ্রী', slug: 'cleaning' },
      { id: 'sub-dinnerware', name: 'Dinner Sets & Glassware', nameBn: 'ডিনার সেট ও গ্লাস', slug: 'dinnerware' },
      { id: 'sub-storage', name: 'Kitchen Storage', nameBn: 'স্টোরেজ বক্স', slug: 'storage' }
    ]
  },
  {
    id: 'cat-baby',
    name: 'Baby & Kids',
    nameBn: 'বেবি ও বাচ্চাদের সামগ্রী',
    slug: 'baby-kids',
    icon: 'Heart',
    description: 'Diapers, formula milk, baby skincare, feeding bottles and safe toys',
    featuredImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    itemCount: 40,
    subcategories: [
      { id: 'sub-diapers', name: 'Diapers & Wipes', nameBn: 'ডায়াপার ও ওয়াইপ্স', slug: 'diapers' },
      { id: 'sub-baby-food', name: 'Baby Food & Formula', nameBn: 'বেবি ফুড ও দুধ', slug: 'baby-food' },
      { id: 'sub-baby-care', name: 'Baby Bath & Skin Care', nameBn: 'বেবি স্কিন কেয়ার', slug: 'baby-care' },
      { id: 'sub-toys', name: 'Toys & Learning', nameBn: 'খেলনা সামগ্রী', slug: 'toys' }
    ]
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    nameBn: 'স্বাস্থ্য ও চিকিৎসা',
    slug: 'health-wellness',
    icon: 'Activity',
    description: 'Over-the-counter essentials, first aid, sanitizers, BP monitors and vitamins',
    featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    itemCount: 50,
    subcategories: [
      { id: 'sub-firstaid', name: 'First Aid & Antiseptic', nameBn: 'ফার্স্ট এইড', slug: 'first-aid' },
      { id: 'sub-otc', name: 'OTC Healthcare', nameBn: 'প্রাথমিক ঔষধ', slug: 'otc' },
      { id: 'sub-devices', name: 'Medical Devices', nameBn: 'মেডিকেল ডিভাইস', slug: 'medical-devices' },
      { id: 'sub-supplements', name: 'Vitamins & Nutrition', nameBn: 'ভিটামিন ও পুষ্টি', slug: 'supplements' }
    ]
  },
  {
    id: 'cat-stationery',
    name: 'Stationery & Books',
    nameBn: 'স্টেশনারি ও বই',
    slug: 'stationery-books',
    icon: 'BookOpen',
    description: 'Pens, spiral notebooks, office supplies, art kits and educational books',
    featuredImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    itemCount: 35,
    subcategories: [
      { id: 'sub-pens', name: 'Pens & Markers', nameBn: 'কলম ও মার্কার', slug: 'pens' },
      { id: 'sub-notebooks', name: 'Notebooks & Diaries', nameBn: 'খাতা ও নোটবুক', slug: 'notebooks' },
      { id: 'sub-office', name: 'Office Supplies', nameBn: 'অফিস সামগ্রী', slug: 'office' }
    ]
  },
  {
    id: 'cat-pet',
    name: 'Pet Supplies',
    nameBn: 'পোষা প্রাণীর খাবার ও যত্ন',
    slug: 'pet-supplies',
    icon: 'Smile',
    description: 'Nutritious cat food, dog biscuits, cat litter, grooming brushes and pet toys',
    featuredImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    itemCount: 25,
    subcategories: [
      { id: 'sub-cat-food', name: 'Cat Food & Treats', nameBn: 'বিড়ালের খাবার', slug: 'cat-food' },
      { id: 'sub-dog-food', name: 'Dog Food', nameBn: 'কুকুরের খাবার', slug: 'dog-food' },
      { id: 'sub-pet-care', name: 'Litter & Grooming', nameBn: 'কেয়ার ও লিটার', slug: 'pet-care' }
    ]
  },
  {
    id: 'cat-sports',
    name: 'Sports & Fitness',
    nameBn: 'খেলাধুলা ও ফিটনেস',
    slug: 'sports-fitness',
    icon: 'Zap',
    description: 'Cricket gear, footballs, badminton rackets, yoga mats and gym accessories',
    featuredImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    itemCount: 30,
    subcategories: [
      { id: 'sub-cricket', name: 'Cricket & Football', nameBn: 'ক্রিকেট ও ফুটবল', slug: 'cricket-football' },
      { id: 'sub-badminton', name: 'Badminton & Tennis', nameBn: 'ব্যাডমিন্টন', slug: 'badminton' },
      { id: 'sub-gym', name: 'Fitness & Yoga', nameBn: 'ফিটনেস ও যোগাসামগ্রী', slug: 'fitness-yoga' }
    ]
  }
];

export const PRODUCTS_DATA: Product[] = FULL_SUPERMARKET_CATALOG;

export const COUPONS_DATA: Coupon[] = [
  {
    code: 'SUPER100',
    discountFlat: 100,
    minSpend: 1000,
    expiryDate: '2026-12-31',
    description: 'Flat ৳100 OFF on orders above ৳1,000',
    descriptionBn: '১,০০০ টাকার বেশি অর্ডারে ফ্ল্যাট ১০০ টাকা ছাড়'
  },
  {
    code: 'RAMADAN20',
    discountPercent: 15,
    maxDiscount: 350,
    minSpend: 1200,
    expiryDate: '2026-12-31',
    description: '15% OFF (up to ৳350) on supermarket essentials',
    descriptionBn: 'সুপারশপ নিত্যপণ্যে ১৫% ছাড় (সর্বোচ্চ ৩৫০ টাকা)'
  },
  {
    code: 'FRESH50',
    discountFlat: 50,
    minSpend: 500,
    expiryDate: '2026-12-31',
    description: '৳50 OFF on fresh fruits, vegetables, meat & fish',
    descriptionBn: 'তাজা ফলমূল ও কাঁচাবাজারে ৫০ টাকা ছাড়'
  },
  {
    code: 'FIRSTBUY',
    discountPercent: 10,
    maxDiscount: 200,
    minSpend: 600,
    expiryDate: '2026-12-31',
    description: '10% Welcome discount on your first supermarket order',
    descriptionBn: 'আপনার প্রথম অর্ডারে ১০% ওয়েলকাম ডিসকাউন্ট'
  }
];

export const DELIVERY_ZONES_DATA: DeliveryZone[] = [
  { id: 'zone-dhk-north', division: 'Dhaka', district: 'Dhaka', name: 'Dhaka North (Gulshan, Banani, Uttara, Mirpur)', baseCharge: 50, expressCharge: 90, estimatedHours: '1 - 2 Hours', active: true },
  { id: 'zone-dhk-south', division: 'Dhaka', district: 'Dhaka', name: 'Dhaka South (Dhanmondi, Motijheel, Old Dhaka)', baseCharge: 50, expressCharge: 90, estimatedHours: '1 - 2 Hours', active: true },
  { id: 'zone-dhk-sub', division: 'Dhaka', district: 'Gazipur', name: 'Greater Dhaka Suburbs (Savar, Gazipur, Narayanganj)', baseCharge: 70, expressCharge: 120, estimatedHours: '2 - 4 Hours', active: true },
  { id: 'zone-ctg', division: 'Chittagong', district: 'Chattogram', name: 'Chattogram Metro (GEC, Agrabad, Nasirabad, Halishahar)', baseCharge: 70, expressCharge: 110, estimatedHours: '2 - 4 Hours', active: true },
  { id: 'zone-sylhet', division: 'Sylhet', district: 'Sylhet', name: 'Sylhet Metro (Zindabazar, Amberkhana, Shahjalal Uposhohor)', baseCharge: 80, expressCharge: 130, estimatedHours: '3 - 5 Hours', active: true },
  { id: 'zone-rajshahi', division: 'Rajshahi', district: 'Rajshahi', name: 'Rajshahi Metro (Shaheb Bazar, Kazihata, Motihar)', baseCharge: 80, expressCharge: 130, estimatedHours: '3 - 5 Hours', active: true },
  { id: 'zone-khulna', division: 'Khulna', district: 'Khulna', name: 'Khulna Metro (Shibbari, Daulatpur, Sonadanga)', baseCharge: 80, expressCharge: 130, estimatedHours: '3 - 5 Hours', active: true }
];

export const SAMPLE_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir@supermart.bd',
    phone: '01711223344',
    role: 'customer',
    loyaltyPoints: 340,
    createdAt: '2026-01-10T10:00:00Z',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home (Dhanmondi)',
        recipientName: 'Tanvir Ahmed',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Dhanmondi',
        streetAddress: 'House 42, Road 7/A, Dhanmondi R/A',
        isDefault: true
      },
      {
        id: 'addr-2',
        title: 'Office (Gulshan 1)',
        recipientName: 'Tanvir Ahmed',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Gulshan',
        streetAddress: 'Level 8, Concord Tower, Gulshan Avenue',
        isDefault: false
      }
    ]
  },
  {
    id: 'user-admin-1',
    name: 'Admin Farhana Haque',
    email: 'admin@supermart.bd',
    phone: '01899112233',
    role: 'super_admin',
    loyaltyPoints: 1200,
    createdAt: '2025-11-01T08:00:00Z',
    addresses: []
  },
  {
    id: 'user-manager-1',
    name: 'Kabir Hossain',
    email: 'manager@supermart.bd',
    phone: '01911998877',
    role: 'store_manager',
    loyaltyPoints: 450,
    createdAt: '2025-12-05T08:00:00Z',
    addresses: []
  },
  {
    id: 'user-agent-1',
    name: 'Sojib Hasan (Rider #104)',
    email: 'rider.sojib@supermart.bd',
    phone: '01677334455',
    role: 'delivery_agent',
    loyaltyPoints: 0,
    createdAt: '2026-02-15T09:00:00Z',
    addresses: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8801',
    orderNumber: 'SM-2026-8801',
    userId: 'user-cust-1',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir@supermart.bd',
    customerPhone: '01711223344',
    items: [
      {
        productId: 'prod-001',
        productName: 'Chashi Premium Chinigura Aromatic Rice',
        nameBn: 'চাষী প্রিমিয়াম চিনিগুঁড়া সুগন্ধি চাল',
        unitPrice: 155,
        quantity: 2,
        totalPrice: 310,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        unit: '1 kg pack'
      },
      {
        productId: 'prod-002',
        productName: 'Rupchanda Fortified Soybean Oil',
        nameBn: 'রূপচাঁদা ফর্টিফাইড সয়াবিন তেল',
        unitPrice: 830,
        quantity: 1,
        totalPrice: 830,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
        unit: '5 Litre Jar'
      },
      {
        productId: 'prod-012',
        productName: 'Farm Fresh Red Eggs (Lal Dim)',
        nameBn: 'ফার্মের ফ্রেশ লাল ডিম',
        unitPrice: 148,
        quantity: 1,
        totalPrice: 148,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
        unit: '12 Pieces (1 Dozen)'
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      title: 'Home (Dhanmondi)',
      recipientName: 'Tanvir Ahmed',
      phone: '01711223344',
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Dhanmondi',
      streetAddress: 'House 42, Road 7/A, Dhanmondi R/A',
      isDefault: true
    },
    deliverySlot: 'Express (Within 60 Mins)',
    deliveryNotes: 'Please ring the doorbell and leave at door if busy.',
    subtotal: 1288,
    discountAmount: 100,
    couponCode: 'SUPER100',
    deliveryFee: 50,
    tax: 0,
    totalAmount: 1238,
    payment: {
      method: 'bKash',
      status: 'Paid',
      transactionId: 'BK9A772X44',
      senderPhone: '01711223344',
      paidAt: '2026-10-30T14:35:00Z',
      amount: 1238
    },
    status: 'Out for Delivery',
    assignedDeliveryAgentId: 'user-agent-1',
    assignedDeliveryAgentName: 'Sojib Hasan (Rider #104)',
    assignedDeliveryAgentPhone: '01677334455',
    timeline: [
      { status: 'Pending', timestamp: '2026-10-30T14:30:00Z', note: 'Order placed by customer via bKash', completed: true },
      { status: 'Confirmed', timestamp: '2026-10-30T14:32:00Z', note: 'Payment verified & order confirmed by system', completed: true },
      { status: 'Processing', timestamp: '2026-10-30T14:35:00Z', note: 'Store inventory picked from Dhanmondi hub', completed: true },
      { status: 'Packed', timestamp: '2026-10-30T14:45:00Z', note: 'Packed in eco-friendly reusable supermarket bag', completed: true },
      { status: 'Out for Delivery', timestamp: '2026-10-30T14:55:00Z', note: 'Rider Sojib Hasan is heading towards customer address', completed: true },
      { status: 'Delivered', timestamp: '', note: 'Expected delivery in 15 minutes', completed: false }
    ],
    createdAt: '2026-10-30T14:30:00Z',
    updatedAt: '2026-10-30T14:55:00Z'
  }
];
