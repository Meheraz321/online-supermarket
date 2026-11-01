export type Role = 'customer' | 'super_admin' | 'store_manager' | 'delivery_agent' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  loyaltyPoints: number;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office"
  recipientName: string;
  phone: string;
  division: string; // e.g. Dhaka, Chittagong
  district: string; // e.g. Dhaka, Gazipur, Chattogram
  area: string; // e.g. Dhanmondi, Gulshan, Mirpur, Uttara, Agrabad
  streetAddress: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
  itemCount: number;
  featuredImage: string;
}

export interface Subcategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight?: string;
  size?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  sku: string;
  slug: string;
  category: string;
  subcategory: string;
  brand: string;
  regularPrice: number;
  discountPrice?: number;
  stockQuantity: number;
  unit: string; // e.g. "1 kg", "500 g", "1 litre", "1 piece", "1 pack"
  weight?: string;
  images: string[];
  description: string;
  descriptionBn: string;
  specifications?: Record<string, string>;
  isPerishable?: boolean;
  expiryDate?: string; // ISO date for inventory tracking
  batchNumber?: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealEndsAt?: string;
  tags?: string[];
  badge?: string; // "Fresh", "Best Seller", "15% OFF", "Organic"
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Ready for Shipment'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod =
  | 'COD' // Cash on delivery
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'Card';

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'Pending' | 'Paid' | 'Failed';
  transactionId?: string;
  senderPhone?: string;
  paidAt?: string;
  amount: number;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    nameBn?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    image: string;
    unit: string;
  }[];
  shippingAddress: Address;
  deliverySlot: string; // e.g. "Express (60 Mins)", "Today 2 PM - 5 PM"
  deliveryNotes?: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  payment: PaymentDetails;
  status: OrderStatus;
  timeline: OrderTimelineItem[];
  assignedDeliveryAgentId?: string;
  assignedDeliveryAgentName?: string;
  assignedDeliveryAgentPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountFlat?: number;
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  description: string;
  descriptionBn: string;
}

export interface DeliveryZone {
  id: string;
  division: string;
  district: string;
  name: string;
  baseCharge: number;
  expressCharge: number;
  estimatedHours: string;
  active: boolean;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  changeQuantity: number;
  remainingQuantity: number;
  type: 'sale' | 'restock' | 'adjustment' | 'expired_waste';
  timestamp: string;
  note: string;
  user: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  category: 'order' | 'delivery' | 'product_quality' | 'refund' | 'general';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  replies: {
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
  }[];
}
