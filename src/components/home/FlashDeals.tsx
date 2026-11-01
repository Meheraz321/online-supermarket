import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../products/ProductCard';

interface FlashDealsProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({ products, onOpenProductModal }) => {
  const { language } = useLanguage();
  const flashProducts = products.filter((p) => p.isFlashDeal).slice(0, 4);

  // Live countdown timer to midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (flashProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Flame className="w-7 h-7 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">
                  {language === 'bn' ? 'আজকের ফ্ল্যাশ সেল' : 'Super Flash Deals'}
                </span>
                <span className="bg-yellow-400 text-red-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Up to 35% OFF
                </span>
              </div>
              <p className="text-xs text-orange-100">
                {language === 'bn' ? 'সীমিত সময়ের জন্য বিশেষ মূল্য ছাড়' : 'Limited stock offers with instant doorstep delivery'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-semibold text-yellow-100 mr-1">
              {language === 'bn' ? 'বাকি সময়:' : 'Ends in:'}
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded-md">{pad(timeLeft.hours)}</span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md">{pad(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid inside Flash section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {flashProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onOpenModal={onOpenProductModal}
                isFlashCard={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
