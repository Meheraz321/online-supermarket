import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  MapPin,
  Globe,
  Menu,
  X,
  PhoneCall,
  Clock,
  ShieldCheck,
  Zap,
  Mic,
  ChevronDown,
  Truck,
  LayoutDashboard,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Product, Role } from '../../types';

interface NavbarProps {
  onSelectCategory: (categoryName: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onOpenRider: () => void;
  onOpenSupport: () => void;
  onOpenAccount: () => void;
  onOpenProductModal: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenTracking,
  onOpenAdmin,
  onOpenRider,
  onOpenSupport,
  onOpenAccount,
  onOpenProductModal,
  searchQuery,
  setSearchQuery
}) => {
  const { language, setLanguage, t, formatPrice } = useLanguage();
  const { user, switchRole, wishlist } = useAuth();
  const { totalItemCount, total, setIsCartOpen } = useCart();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Dhaka (Dhanmondi / Gulshan)');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSearchingVoice, setIsSearchingVoice] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cities = [
    'Dhaka (Dhanmondi / Gulshan)',
    'Dhaka (Uttara / Mirpur)',
    'Chattogram (GEC / Agrabad)',
    'Sylhet (Zindabazar / Shahjalal)',
    'Rajshahi (Shaheb Bazar)',
    'Khulna (Shibbari)'
  ];

  // Live search suggestions from backend
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        const json = await res.json();
        if (json.success && json.data) {
          setSuggestions(json.data);
          setShowSuggestions(true);
        }
      } catch (e) {
        // quiet error
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsSearchingVoice(true);
    // Simulate speech recognition for voice search
    setTimeout(() => {
      const popularVoices = ['Chinigura Rice', 'Hilsa Fish', 'Soybean Oil', 'Fresh Milk', 'Tomatoes'];
      const pick = popularVoices[Math.floor(Math.random() * popularVoices.length)];
      setSearchQuery(pick);
      setIsSearchingVoice(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#0B6623] text-white text-xs py-1.5 px-4 font-medium transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-100 font-semibold">
              <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              {t('freeDeliveryMsg')}
            </span>
            <span className="hidden sm:inline-block text-emerald-300">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-100">
              <Clock className="w-3.5 h-3.5" />
              {t('expressDelivery')}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-emerald-100">
            <button
              onClick={onOpenTracking}
              className="hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-orange-300" />
              <span>{t('orderTracking')}</span>
            </button>

            <button
              onClick={onOpenSupport}
              className="hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Hotline: 16999</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="bg-emerald-900/60 hover:bg-emerald-900 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs border border-emerald-700/50 cursor-pointer font-bold transition"
            >
              <Globe className="w-3 h-3 text-orange-300" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectCategory('All')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0B6623] to-[#15803d] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0B6623]">
                    SUPER
                  </span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-orange-500">
                    MART
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium hidden sm:block -mt-1 tracking-wider uppercase">
                  {t('tagline')}
                </p>
              </div>
            </button>

            {/* Delivery Location Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-500 bg-gray-50/80 hover:bg-emerald-50/40 text-left transition text-xs cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] text-gray-500 block">Deliver to:</span>
                  <span className="font-semibold text-gray-800 line-clamp-1 max-w-[130px]">
                    {selectedCity.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    Select Your Delivery Area
                  </div>
                  <div className="py-1">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition flex items-center justify-between cursor-pointer ${
                          selectedCity === city
                            ? 'bg-emerald-50 text-[#0B6623] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <CheckCircle className="w-3.5 h-3.5 text-[#0B6623]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar with Live Suggestions & Voice Search */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-24 py-2.5 sm:py-2.5 bg-gray-100 hover:bg-gray-50 focus:bg-white text-gray-900 text-sm rounded-full border border-gray-200 focus:border-[#0B6623] focus:ring-2 focus:ring-emerald-500/20 outline-none transition shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />

              <div className="absolute right-2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {/* Voice search button */}
                <button
                  onClick={handleVoiceSearch}
                  title="Voice Search"
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    isSearchingVoice
                      ? 'bg-red-500 text-white animate-bounce'
                      : 'text-gray-500 hover:text-[#0B6623] hover:bg-emerald-50'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectCategory('All')}
                  className="bg-[#0B6623] hover:bg-emerald-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hidden sm:block transition shadow-xs"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Suggested Products ({suggestions.length})</span>
                  <span className="text-emerald-700">Press enter for all</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {suggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onOpenProductModal(prod);
                        setShowSuggestions(false);
                      }}
                      className="p-2 hover:bg-emerald-50/50 rounded-xl flex items-center justify-between cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-[#0B6623] line-clamp-1">
                            {language === 'bn' ? prod.nameBn : prod.name}
                          </p>
                          <span className="text-[11px] text-gray-400 block">
                            {prod.category} • {prod.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0B6623]">
                          {formatPrice(prod.discountPrice || prod.regularPrice)}
                        </span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            {formatPrice(prod.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Role Switcher, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-[#0B6623] border border-emerald-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                title="Switch test role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="capitalize hidden md:inline">
                  {user ? user.role.replace('_', ' ') : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-600" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Active Portal
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        switchRole('customer');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 flex items-center justify-between cursor-pointer"
                    >
                      <span>Customer View</span>
                      {user?.role === 'customer' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('super_admin');
                        setIsRoleMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-purple-50 text-purple-700 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Super Admin Panel
                      </span>
                      {user?.role === 'super_admin' && <CheckCircle className="w-3 h-3 text-purple-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('delivery_agent');
                        setIsRoleMenuOpen(false);
                        onOpenRider();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-orange-50 text-orange-700 font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        Rider Dashboard
                      </span>
                      {user?.role === 'delivery_agent' && <CheckCircle className="w-3 h-3 text-orange-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenAccount}
              className="relative p-2 text-gray-700 hover:text-[#0B6623] hover:bg-gray-100 rounded-full transition cursor-pointer hidden sm:flex"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Profile Button */}
            <button
              onClick={onOpenAccount}
              className="p-2 text-gray-700 hover:text-[#0B6623] hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="Account"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#0B6623] hover:bg-emerald-800 text-white px-3 sm:px-4 py-2 rounded-full shadow-md shadow-emerald-900/20 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[10px] text-emerald-200 block">Total</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
