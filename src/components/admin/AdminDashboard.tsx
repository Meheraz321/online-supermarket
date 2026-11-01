import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Printer,
  Calendar,
  Search,
  DollarSign,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product, Order, OrderStatus, Category } from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onViewInvoice: (order: Order) => void;
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  categories,
  onViewInvoice,
  onRefreshProducts
}) => {
  const { formatPrice } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'staff'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Add Product Form Modal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.name || 'Grocery & Daily Essentials');
  const [newProdBrand, setNewProdBrand] = useState('Super Mart');
  const [newProdRegularPrice, setNewProdRegularPrice] = useState(150);
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState<number | ''>('');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdUnit, setNewProdUnit] = useState('1 kg pack');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
  const [newProdIsPerishable, setNewProdIsPerishable] = useState(false);
  const [newProdExpiry, setNewProdExpiry] = useState('2026-11-15');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resStats, resProds, resOrds, resInv] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/products?limit=100').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/inventory').then((r) => r.json())
      ]);

      if (resStats.success) setStats(resStats.data);
      if (resProds.success) setProducts(resProds.data);
      if (resOrds.success) setOrders(resOrds.data);
      if (resInv.success) setInventoryData(resInv.data);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          nameBn: newProdNameBn || newProdName,
          category: newProdCategory,
          brand: newProdBrand,
          regularPrice: Number(newProdRegularPrice),
          discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : undefined,
          stockQuantity: Number(newProdStock),
          unit: newProdUnit,
          images: [newProdImg],
          isPerishable: newProdIsPerishable,
          expiryDate: newProdIsPerishable ? newProdExpiry : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAddingProduct(false);
        setNewProdName('');
        setNewProdNameBn('');
        fetchDashboardData();
        onRefreshProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStock = async (prodId: string, currentStock: number, delta: number) => {
    const newQty = Math.max(0, currentStock + delta);
    try {
      await fetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newQty })
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === prodId ? { ...p, stockQuantity: newQty } : p))
      );
      onRefreshProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await fetch(`/api/products/${prodId}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
      onRefreshProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'All' ? true : o.status === orderStatusFilter
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in fade-in zoom-in-95"
      >
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black">SUPER MART Enterprise Admin</h2>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Role: Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-400">Inventory, Orders, Hub Dispatch &amp; Sales Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2 text-gray-400 hover:text-white rounded-full transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-6 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview &amp; KPI</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Management ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders &amp; Dispatch ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span>Inventory &amp; Perishables</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 px-4 transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'staff'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Staff Roles &amp; RBAC</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
                    {formatPrice(stats.totalRevenue || 1238)}
                  </p>
                  <span className="text-[10px] text-emerald-700 mt-1 block">Live calculated</span>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-blue-950 mt-1">
                    {stats.totalOrders}
                  </p>
                  <span className="text-[10px] text-blue-700 mt-1 block">
                    {stats.pendingOrders} pending confirmation
                  </span>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                    Active Catalog
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                    {stats.totalProducts} Items
                  </p>
                  <span className="text-[10px] text-purple-700 mt-1 block">Across 14 categories</span>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    Low Stock Alerts
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
                    {stats.lowStockCount} Products
                  </p>
                  <span className="text-[10px] text-amber-700 mt-1 block">Requires supplier restock</span>
                </div>
              </div>

              {/* Category Sales Breakdown */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Department Sales Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {stats.categorySales && Object.entries(stats.categorySales).map(([cat, val]: any) => (
                    <div key={cat} className="p-3 bg-white rounded-xl border border-gray-100 shadow-xs">
                      <span className="text-[11px] font-bold text-gray-700 block truncate">{cat}</span>
                      <p className="text-sm font-black text-[#0B6623] mt-1">{formatPrice(val)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, SKU or category..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-purple-600"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>

                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Product Modal Form */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-4 text-xs"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-purple-200">
                    <h3 className="font-bold text-purple-950 text-sm">Add New Product to Supermarket</h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Product Name (English)</label>
                      <input
                        type="text"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Fresh Deshi Mustard Oil 1L"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Product Name (Bangla)</label>
                      <input
                        type="text"
                        value={newProdNameBn}
                        onChange={(e) => setNewProdNameBn(e.target.value)}
                        placeholder="e.g. খাঁটি সরিষার তেল ১ লিটার"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Brand</label>
                      <input
                        type="text"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Unit</label>
                      <input
                        type="text"
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        placeholder="e.g. 1 kg, 500 ml"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Regular Price (৳)</label>
                      <input
                        type="number"
                        value={newProdRegularPrice}
                        onChange={(e) => setNewProdRegularPrice(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Discount Price (৳)</label>
                      <input
                        type="number"
                        value={newProdDiscountPrice}
                        onChange={(e) => setNewProdDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Leave blank if no discount"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Initial Stock</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl cursor-pointer hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold cursor-pointer hover:bg-purple-700"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Controls</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {p.sku} &bull; {p.unit}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">{p.category}</td>
                        <td className="p-3">
                          <span className="font-black text-gray-900">
                            {formatPrice(p.discountPrice || p.regularPrice)}
                          </span>
                          {p.discountPrice && (
                            <span className="text-[10px] text-gray-400 line-through block">
                              {formatPrice(p.regularPrice)}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStock(p.id, p.stockQuantity, -5)}
                              className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                              title="-5"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-xs ${
                                p.stockQuantity === 0
                                  ? 'bg-red-100 text-red-700'
                                  : p.stockQuantity <= 10
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-[#0B6623]'
                              }`}
                            >
                              {p.stockQuantity}
                            </span>
                            <button
                              onClick={() => handleUpdateStock(p.id, p.stockQuantity, 10)}
                              className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                              title="+10"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-600">Filter Status:</span>
                {['All', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Out for Delivery', 'Delivered'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="p-3">Order No</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status Workflow</th>
                      <th className="p-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono font-bold text-gray-900">{ord.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{ord.customerName}</p>
                          <span className="text-[10px] text-gray-500">{ord.shippingAddress.area}</span>
                        </td>
                        <td className="p-3 font-black text-gray-900">{formatPrice(ord.totalAmount)}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded">
                            {ord.payment.method} ({ord.payment.status})
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 outline-none focus:border-purple-600 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onViewInvoice(ord)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && inventoryData && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-orange-950 text-sm">Perishable Goods Expiration Tracking</h3>
                  <p className="text-orange-800 text-[11px] mt-0.5">
                    Fresh fruits, milk, dairy, meat and fish require strict shelf-life monitoring.
                  </p>
                </div>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {inventoryData.perishableItems?.length || 0} Tracked Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inventoryData.perishableItems?.map((p: any) => (
                  <div key={p.id} className="p-3.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
                    <div>
                      <h4 className="font-bold text-gray-900">{p.name}</h4>
                      <p className="text-gray-500 text-[11px]">Category: {p.category}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Shelf Expiry: {p.expiryDate || 'Nov 15, 2026'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold bg-emerald-50 text-[#0B6623] px-2 py-1 rounded-md block mb-1">
                        Stock: {p.stockQuantity}
                      </span>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stockQuantity, 20)}
                        className="bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-emerald-800"
                      >
                        Restock +20
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAFF & ROLES TAB */}
          {activeTab === 'staff' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Super Mart Role-Based Access Control (RBAC)</h3>
                <p className="text-gray-500 text-[11px]">
                  Employees are provisioned with tailored security scopes to guarantee segregation of duties.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { role: 'Super Admin', user: 'Admin Farhana Haque', email: 'admin@supermart.bd', desc: 'Full root access: catalogs, financial reports, employee permissions, payment gateways.' },
                  { role: 'Store Manager', user: 'Kabir Hossain', email: 'manager@supermart.bd', desc: 'Manage stock levels, receive supplier purchase orders, inspect freshness, approve returns.' },
                  { role: 'Delivery Agent', user: 'Sojib Hasan (Rider #104)', email: 'rider.sojib@supermart.bd', desc: 'Accept assigned dispatches, update live GPS progress, collect cash on delivery.' },
                  { role: 'Customer Support', user: 'Fatema Tuz Zohra', email: 'support@supermart.bd', desc: 'Handle live customer inquiries, tickets, missing item claims, promo inquiries.' }
                ].map((s) => (
                  <div key={s.role} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-purple-900">{s.role}</span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{s.user}</p>
                    <p className="text-[11px] text-gray-400">{s.email}</p>
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
