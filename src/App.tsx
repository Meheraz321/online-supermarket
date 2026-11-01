/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { MegaMenu } from './components/layout/MegaMenu';
import { HeroBanner } from './components/home/HeroBanner';
import { CategorySlider } from './components/home/CategorySlider';
import { FlashDeals } from './components/home/FlashDeals';
import { ProductCard } from './components/products/ProductCard';
import { ProductFilterSidebar } from './components/products/ProductFilterSidebar';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { InvoiceModal } from './components/order/InvoiceModal';
import { OrderTrackingModal } from './components/order/OrderTrackingModal';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliveryAgentDashboard } from './components/delivery/DeliveryAgentDashboard';
import { CustomerSupportModal } from './components/support/CustomerSupportModal';
import { Footer } from './components/layout/Footer';
import { Product, Category, Order } from './types';
import { CATEGORIES_DATA, PRODUCTS_DATA } from './data/seedData';
import {
  ShoppingBag,
  Sparkles,
  Home,
  Grid,
  Heart,
  User as UserIcon,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';

function SuperMartMain() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();

  // Data states
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_DATA);
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRiderOpen, setIsRiderOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Fetch initial products and categories from backend REST API
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
      const resCat = await fetch('/api/categories');
      const dataCat = await resCat.json();
      if (dataCat.success && dataCat.data) {
        setCategories(dataCat.data);
      }
    } catch (e) {
      console.warn('API error, using initial catalog', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products client-side for ultra-fast instant UI responsiveness
  const filteredProducts = products.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchTag = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchBrand && !matchSku && !matchTag) return false;
    }

    // Category
    if (selectedCategory !== 'All') {
      if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // Subcategory
    if (selectedSubcategory !== 'All') {
      if (p.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
    }

    // Brand
    if (selectedBrand !== 'All') {
      if (p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    }

    // Price
    const currentPrice = p.discountPrice || p.regularPrice;
    if (currentPrice < minPrice || currentPrice > maxPrice) return false;

    // In Stock
    if (inStockOnly && p.stockQuantity <= 0) return false;

    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.regularPrice;
    const priceB = b.discountPrice || b.regularPrice;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') {
      const discA = a.discountPrice ? (a.regularPrice - a.discountPrice) / a.regularPrice : 0;
      const discB = b.discountPrice ? (b.regularPrice - b.discountPrice) / b.regularPrice : 0;
      return discB - discA;
    }
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const handleSelectCategory = (catName: string, subcategory?: string) => {
    setSelectedCategory(catName);
    setSelectedSubcategory(subcategory || 'All');
    setSearchQuery('');
    // Scroll down to products catalog smoothly
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrand('All');
    setMinPrice(0);
    setMaxPrice(5000);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
  };

  const handleOrderSuccess = (order: Order) => {
    setInvoiceOrder(order);
  };

  const handleOpenTrackingFromInvoice = (order: Order) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. Header & Navigation */}
      <div>
        <Navbar
          onSelectCategory={handleSelectCategory}
          onOpenTracking={() => setIsTrackingModalOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenRider={() => setIsRiderOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenProductModal={(p) => setSelectedProduct(p)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <MegaMenu
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onOpenDeals={() => {
            const el = document.getElementById('flash-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Hero Carousel Banners */}
        {selectedCategory === 'All' && !searchQuery && (
          <HeroBanner
            onExplore={handleSelectCategory}
            onOpenCoupon={(code) => {
              setIsCartOpen(true);
            }}
          />
        )}

        {/* 3. Category Circles */}
        {selectedCategory === 'All' && !searchQuery && (
          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* 4. Flash Deals Section */}
        {selectedCategory === 'All' && !searchQuery && (
          <div id="flash-section">
            <FlashDeals
              products={products}
              onOpenProductModal={(p) => setSelectedProduct(p)}
            />
          </div>
        )}

        {/* 5. Main Catalog Section (Filter Sidebar + Products Grid) */}
        <div id="catalog-section" className="max-w-7xl mx-auto px-4 py-8">
          {/* Catalog Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {selectedCategory === 'All'
                    ? language === 'bn'
                      ? 'সকল সুপারমার্কেট পণ্য'
                      : 'All Supermarket Essentials'
                    : selectedCategory}
                </h2>
                {selectedSubcategory !== 'All' && (
                  <span className="text-xs bg-emerald-100 text-[#0B6623] font-bold px-2.5 py-1 rounded-full">
                    {selectedSubcategory}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Showing {sortedProducts.length} verified products available for instant doorstep delivery
              </p>
            </div>

            {/* Mobile Filter Toggle & Quick Reset */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#0B6623]" />
                <span>Filters &amp; Sort</span>
              </button>

              {(selectedCategory !== 'All' || selectedBrand !== 'All' || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar Desktop */}
            <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
              <ProductFilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory('All');
                }}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onReset={handleResetFilters}
              />
            </div>

            {/* Products Cards Grid */}
            <div className="lg:col-span-3">
              {sortedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">No products match your filters</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try relaxing your price range or search terms to see all available supermarket groceries.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 bg-[#0B6623] hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenModal={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRider={() => setIsRiderOpen(true)}
      />

      {/* 7. Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-gray-600 shadow-lg">
        <button
          onClick={() => {
            handleResetFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 hover:text-[#0B6623] cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 hover:text-[#0B6623] cursor-pointer"
        >
          <Grid className="w-4 h-4" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 hover:text-[#0B6623] cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={() => setIsTrackingModalOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-[#0B6623] cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>Track</span>
        </button>

        <button
          onClick={() => setIsAccountOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-[#0B6623] cursor-pointer"
        >
          <UserIcon className="w-4 h-4" />
          <span>Account</span>
        </button>
      </div>

      {/* 8. Modals Container */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        onTrackOrder={handleOpenTrackingFromInvoice}
      />

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        initialOrder={trackingOrder}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingOrder(null);
        }}
      />

      <CustomerDashboard
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onViewInvoice={(ord) => setInvoiceOrder(ord)}
        onTrackOrder={(ord) => {
          setTrackingOrder(ord);
          setIsTrackingModalOpen(true);
        }}
        onOpenProductModal={(p) => setSelectedProduct(p)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        onViewInvoice={(ord) => setInvoiceOrder(ord)}
        onRefreshProducts={fetchProducts}
      />

      <DeliveryAgentDashboard
        isOpen={isRiderOpen}
        onClose={() => setIsRiderOpen(false)}
        onViewInvoice={(ord) => setInvoiceOrder(ord)}
      />

      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <SuperMartMain />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
