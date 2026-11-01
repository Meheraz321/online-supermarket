import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Sparkles,
  Zap,
  ShoppingBag,
  Apple,
  Fish,
  Milk,
  Coffee,
  Smartphone,
  Shirt,
  Heart,
  Home,
  Activity,
  BookOpen,
  Smile,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Category } from '../../types';

interface MegaMenuProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string, subcategory?: string) => void;
  onOpenDeals: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenDeals
}) => {
  const { language, t } = useLanguage();
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Apple': return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'Fish': return <Fish className="w-4 h-4 text-emerald-600" />;
      case 'Milk': return <Milk className="w-4 h-4 text-emerald-600" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-emerald-600" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'Home': return <Home className="w-4 h-4 text-emerald-600" />;
      case 'Heart': return <Heart className="w-4 h-4 text-emerald-600" />;
      case 'Activity': return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'Smile': return <Smile className="w-4 h-4 text-emerald-600" />;
      default: return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative border-b border-gray-100 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
          {/* Mega Menu Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setIsMegaOpen(!isMegaOpen)}
              onMouseEnter={() => setIsMegaOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition cursor-pointer shrink-0 ${
                isMegaOpen
                  ? 'bg-[#0B6623] text-white shadow-xs'
                  : 'bg-emerald-50 text-[#0B6623] hover:bg-emerald-100/70'
              }`}
            >
              <Menu className="w-4 h-4" />
              <span>{t('allCategories')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            {isMegaOpen && (
              <div
                onMouseLeave={() => setIsMegaOpen(false)}
                className="absolute left-0 top-full mt-1 w-[92vw] max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category List */}
                  <div className="space-y-1 max-h-[460px] overflow-y-auto pr-2 border-r border-gray-100">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                      Main Departments
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onClick={() => {
                          onSelectCategory(cat.name);
                          setIsMegaOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer text-xs font-semibold ${
                          (hoveredCategory?.id === cat.id || (!hoveredCategory && cat.id === 'cat-grocery'))
                            ? 'bg-emerald-50 text-[#0B6623]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {getCategoryIcon(cat.icon)}
                          <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                        </div>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
                          {cat.itemCount || 20}+
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Subcategories View for Hovered Category */}
                  <div className="col-span-2 pl-2">
                    {(() => {
                      const active = hoveredCategory || categories[0];
                      if (!active) return null;
                      return (
                        <div>
                          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                {getCategoryIcon(active.icon)}
                                {language === 'bn' ? active.nameBn : active.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">{active.description}</p>
                            </div>
                            <button
                              onClick={() => {
                                onSelectCategory(active.name);
                                setIsMegaOpen(false);
                              }}
                              className="text-xs text-[#0B6623] hover:underline font-semibold cursor-pointer"
                            >
                              View All &rarr;
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {active.subcategories.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  onSelectCategory(active.name, sub.name);
                                  setIsMegaOpen(false);
                                }}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 text-left transition cursor-pointer group"
                              >
                                <div>
                                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#0B6623]">
                                    {language === 'bn' ? sub.nameBn : sub.name}
                                  </span>
                                </div>
                                <span className="text-emerald-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                  &rarr;
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Promotional Banner in Mega Menu */}
                          <div className="mt-5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Zap className="w-5 h-5 text-orange-500" />
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  Fresh Daily Guarantee
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  Directly sourced from trusted local farmers and certified suppliers.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onSelectCategory('Fruits & Vegetables');
                                setIsMegaOpen(false);
                              }}
                              className="bg-[#0B6623] text-white text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                            >
                              Shop Fresh
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Category Links */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer shrink-0 ${
              selectedCategory === 'All'
                ? 'text-[#0B6623] bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => onSelectCategory('Fruits & Vegetables')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1.5 font-medium ${
              selectedCategory === 'Fruits & Vegetables'
                ? 'text-[#0B6623] bg-emerald-50 font-bold'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <span>🥬 Fresh Produce</span>
          </button>

          <button
            onClick={() => onSelectCategory('Meat & Seafood')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1.5 font-medium ${
              selectedCategory === 'Meat & Seafood'
                ? 'text-[#0B6623] bg-emerald-50 font-bold'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <span>🐟 Meat & Fish</span>
          </button>

          <button
            onClick={() => onSelectCategory('Grocery & Daily Essentials')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1.5 font-medium ${
              selectedCategory === 'Grocery & Daily Essentials'
                ? 'text-[#0B6623] bg-emerald-50 font-bold'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <span>🌾 Daily Groceries</span>
          </button>

          <button
            onClick={() => onSelectCategory('Electronics & Gadgets')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1.5 font-medium ${
              selectedCategory === 'Electronics & Gadgets'
                ? 'text-[#0B6623] bg-emerald-50 font-bold'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <span>📱 Electronics</span>
          </button>

          <button
            onClick={onOpenDeals}
            className="px-2.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1 text-orange-600 bg-orange-50 hover:bg-orange-100 font-bold"
          >
            <Percent className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('flashSale')}</span>
          </button>
        </div>

        {/* Free Shipping Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 font-medium py-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Halal &amp; Authentic Supermarket Products</span>
        </div>
      </div>
    </div>
  );
};
