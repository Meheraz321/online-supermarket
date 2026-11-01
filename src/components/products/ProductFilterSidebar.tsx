import React from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductFilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  onReset
}) => {
  const { language, formatPrice } = useLanguage();

  const brands = [
    'All',
    'Chashi',
    'Rupchanda',
    'Teer',
    'Radhuni',
    'Ispahani',
    'Aarong Dairy',
    'Anker',
    'Xiaomi',
    'Baseus',
    'Pampers',
    'Nivea',
    'Kiam'
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0B6623]" />
          <span className="font-extrabold text-gray-900 text-sm">Filters &amp; Sort</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-2">Sort Products</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#0B6623] cursor-pointer"
        >
          <option value="featured">Featured &amp; Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-2">Category</label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-emerald-50 text-[#0B6623] font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-[#0B6623]" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-emerald-50 text-[#0B6623] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="line-clamp-1">{language === 'bn' ? cat.nameBn : cat.name}</span>
              {selectedCategory.toLowerCase() === cat.name.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-[#0B6623]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
          <span>Max Price</span>
          <span className="text-[#0B6623]">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={maxPrice}
          onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
          className="w-full accent-[#0B6623] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>৳50</span>
          <span>৳2,500</span>
          <span>৳5,000+</span>
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-2">Brand</label>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => onSelectBrand(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                selectedBrand === b
                  ? 'bg-[#0B6623] text-white border-[#0B6623]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gray-800 block">In-Stock Only</span>
          <span className="text-[10px] text-gray-400">Hide out of stock items</span>
        </div>
        <button
          onClick={() => onToggleInStock(!inStockOnly)}
          className={`w-11 h-6 rounded-full transition p-1 cursor-pointer ${
            inStockOnly ? 'bg-[#0B6623]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              inStockOnly ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
