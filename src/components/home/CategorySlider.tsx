import React from 'react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShoppingBag,
  Apple,
  Fish,
  Milk,
  Coffee,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Heart,
  Activity,
  BookOpen,
  Smile,
  Zap
} from 'lucide-react';

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const { language } = useLanguage();

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6" />;
      case 'Apple': return <Apple className="w-6 h-6" />;
      case 'Fish': return <Fish className="w-6 h-6" />;
      case 'Milk': return <Milk className="w-6 h-6" />;
      case 'Coffee': return <Coffee className="w-6 h-6" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6" />;
      case 'Shirt': return <Shirt className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Home': return <Home className="w-6 h-6" />;
      case 'Heart': return <Heart className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Smile': return <Smile className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>{language === 'bn' ? 'ক্যাটাগরি অনুযায়ী শপিং করুন' : 'Shop by Category'}</span>
          </h2>
          <p className="text-xs text-gray-500">
            {language === 'bn' ? 'সকল ডিপার্টমেন্ট ও তাজা নিত্যপণ্য' : 'Everything you need in one super store'}
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('All')}
          className="text-xs font-bold text-[#0B6623] hover:underline cursor-pointer"
        >
          {language === 'bn' ? 'সব দেখুন' : 'View All (14 Categories)'} &rarr;
        </button>
      </div>

      {/* Horizontal Category Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {categories.slice(0, 14).map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer group border ${
                isSelected
                  ? 'bg-emerald-50 border-[#0B6623] shadow-md ring-2 ring-[#0B6623]/20 scale-102'
                  : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 mb-2 ${
                  isSelected
                    ? 'bg-[#0B6623] text-white shadow-md'
                    : 'bg-emerald-50 text-[#0B6623] group-hover:bg-[#0B6623] group-hover:text-white'
                }`}
              >
                {getIcon(cat.icon)}
              </div>
              <span className={`text-[11px] sm:text-xs font-bold line-clamp-1 ${
                isSelected ? 'text-[#0B6623]' : 'text-gray-800 group-hover:text-[#0B6623]'
              }`}>
                {language === 'bn' ? cat.nameBn : cat.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                {language === 'bn' ? `${cat.itemCount || 20}+ টি পণ্য` : `${cat.itemCount || 20}+ items`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
