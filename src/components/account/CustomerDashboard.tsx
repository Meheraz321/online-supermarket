import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  Gift,
  ShieldCheck,
  Plus,
  Trash2,
  Printer,
  Truck,
  RotateCcw,
  Sparkles,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Order, Product } from '../../types';

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onOpenProductModal: (product: Product) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  isOpen,
  onClose,
  onViewInvoice,
  onTrackOrder,
  onOpenProductModal
}) => {
  const { user, wishlist, saveAddress, removeAddress, toggleWishlist } = useAuth();
  const { language, formatPrice } = useLanguage();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'loyalty'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('Home');
  const [newArea, setNewArea] = useState('Dhanmondi');
  const [newStreet, setNewStreet] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    // Fetch user orders
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          // If customer, filter by user id or show all sample
          const myOrders = d.data.filter((o: Order) => o.userId === user?.id || user?.role === 'super_admin');
          setOrders(myOrders.length > 0 ? myOrders : d.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));

    // Fetch wishlist items
    if (wishlist.length > 0) {
      fetch('/api/products')
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data) {
            setWishlistProducts(d.data.filter((p: Product) => wishlist.includes(p.id)));
          }
        });
    }
  }, [isOpen, user, wishlist]);

  if (!isOpen) return null;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    saveAddress({
      title: newTitle,
      recipientName: user?.name || 'Valued Customer',
      phone: user?.phone || '01711223344',
      division: 'Dhaka',
      district: 'Dhaka',
      area: newArea,
      streetAddress: newStreet,
      isDefault: false
    });
    setNewStreet('');
    setIsAddingAddress(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Create minimal product instance to add to cart
      addToCart(
        {
          id: item.productId,
          name: item.productName,
          nameBn: item.nameBn || item.productName,
          sku: 'SM-REORDER',
          slug: 'reorder',
          category: 'Grocery & Daily Essentials',
          subcategory: 'General',
          brand: 'Super Mart',
          regularPrice: item.unitPrice,
          discountPrice: item.unitPrice,
          stockQuantity: 100,
          unit: item.unit,
          images: [item.image],
          description: '',
          descriptionBn: '',
          rating: 5,
          reviewCount: 1,
          reviews: []
        },
        item.quantity
      );
    });
    alert('All items from this order have been added to your shopping cart!');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in fade-in zoom-in-95"
      >
        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-[#0B6623] to-emerald-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-md flex items-center justify-center text-white shrink-0">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">{user?.name}</h2>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">{user?.phone} &bull; {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Loyalty Points</span>
              <span className="text-lg font-black text-yellow-300 flex items-center justify-center gap-1">
                <Gift className="w-4 h-4" />
                {user?.loyaltyPoints || 340} pts
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/60 px-6 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#0B6623] text-[#0B6623] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3.5 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#0B6623] text-[#0B6623] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user?.addresses?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3.5 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'border-[#0B6623] text-[#0B6623] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-3.5 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'loyalty'
                ? 'border-[#0B6623] text-[#0B6623] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Rewards &amp; Tier</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No orders placed yet. Start grocery shopping today!
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 transition-colors bg-white shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-gray-900 block">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Placed on {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-emerald-50 text-[#0B6623] border border-emerald-200 text-xs font-bold rounded-lg">
                          {ord.status}
                        </span>
                        <span className="font-bold text-xs text-gray-900">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                          />
                          <div className="truncate">
                            <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                            <span className="text-[10px] text-gray-400">
                              {item.quantity} &times; {formatPrice(item.unitPrice)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-[11px] text-gray-500">
                        <span>Slot: {ord.deliverySlot}</span> &bull; <span>Pay: {ord.payment.method}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => onTrackOrder(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B6623] text-white hover:bg-emerald-800 font-semibold cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 font-semibold cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-700">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-[#0B6623] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900">New Address</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Address Label</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Home, Office, Mom's House"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Thana / Area</label>
                      <input
                        type="text"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        placeholder="e.g. Dhanmondi, Gulshan, Uttara"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Full Street Address</label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. House 14, Road 2, Sector 3"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0B6623] text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-white shadow-xs relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-[#0B6623] px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700">{addr.streetAddress}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {addr.area}, {addr.district}, {addr.division}
                        </p>
                        <p className="text-[11px] text-gray-500">{addr.phone}</p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No addresses saved yet.</p>
                )}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Your wishlist is empty. Tap the heart icon on any product to save it here!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 cursor-pointer"
                        onClick={() => onOpenProductModal(p)}
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => onOpenProductModal(p)}
                          className="text-xs font-bold text-gray-900 truncate hover:text-[#0B6623] cursor-pointer"
                        >
                          {p.name}
                        </h4>
                        <span className="text-xs font-black text-[#0B6623] block">
                          {formatPrice(p.discountPrice || p.regularPrice)}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="bg-[#0B6623] text-white px-2.5 py-1 rounded-md text-[11px] font-bold hover:bg-emerald-800 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="text-gray-400 hover:text-rose-500 text-[11px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOYALTY & REWARDS TAB */}
          {activeTab === 'loyalty' && (
            <div className="space-y-4 text-xs">
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <span className="text-amber-800 font-bold block mb-1">Super Mart Gold Member Tier</span>
                <p className="text-gray-700 leading-relaxed">
                  Earn 1 Super Point for every ৳20 spent. Redeem points directly for instant discounts on future supermarket orders.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Current Balance</span>
                    <p className="text-xl font-black text-amber-900">{user?.loyaltyPoints || 340} Points</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Redeem Value</span>
                    <p className="text-xl font-black text-[#0B6623]">
                      ৳{Math.round((user?.loyaltyPoints || 340) / 2)} Discount
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
