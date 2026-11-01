import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Clock, ShieldCheck, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroBannerProps {
  onExplore: (category: string) => void;
  onOpenCoupon: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore, onOpenCoupon }) => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: '⚡ Instant 60-Minute Delivery',
      badgeBn: '⚡ ৬০ মিনিটে সুপারফাস্ট ডেলিভারি',
      title: 'Online Supermarket at Your Doorstep',
      titleBn: 'আপনার দরজায় নির্ভরযোগ্য অনলাইন সুপারশপ',
      subtitle: 'Rice, edible oils, spices, fresh produce & daily home essentials delivered in minutes across Dhaka & major cities.',
      subtitleBn: 'চাল, ডাল, তেল, মাছ, মাংস ও নিত্যপণ্য—সরাসরি আপনার ঠিকানায় নির্ভেজাল সুপারশপ ডেলিভারি।',
      buttonText: 'Order Daily Essentials',
      buttonTextBn: 'বাজার করুন এখনই',
      category: 'Grocery & Daily Essentials',
      bgGradient: 'from-emerald-900 via-emerald-800 to-teal-900',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      highlight: '৳100 OFF with code SUPER100',
      couponCode: 'SUPER100'
    },
    {
      id: 2,
      badge: '🐟 100% River Fresh & Halal',
      badgeBn: '🐟 তাজা পদ্মা ইলিশ ও হালাল মাংস',
      title: 'Fresh Padma Hilsa & Premium Cuts',
      titleBn: 'পদ্মার খাঁটি রূপালী ইলিশ ও সেরা মাংস',
      subtitle: 'Directly sourced from trusted fish landing centers & certified halal abattoirs. Cleaned, sliced and vacuum chilled.',
      subtitleBn: 'পদ্মার তাজা ইলিশ এবং নিজস্ব তত্ত্বাবধানে প্রস্তুতকৃত ১০০% হালাল ফ্রেশ গরুর ও খাসির মাংস।',
      buttonText: 'Shop Fish & Meat',
      buttonTextBn: 'মাছ ও মাংস কিনুন',
      category: 'Meat & Seafood',
      bgGradient: 'from-blue-900 via-slate-900 to-emerald-950',
      imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80',
      highlight: '৳50 OFF on Fresh Produce',
      couponCode: 'FRESH50'
    },
    {
      id: 3,
      badge: '🎧 Gadgets Super Sale',
      badgeBn: '🎧 অরিজিনাল গ্যাজেট মেগা ডিসকাউন্ট',
      title: 'Smartwatches, Speakers & Fast Chargers',
      titleBn: 'স্মার্টওয়াচ, স্পিকার ও ব্রান্ডেড অ্যাক্সেসরিজ',
      subtitle: 'Authentic electronics from Anker, Baseus, Xiaomi and Haylou with official warranty and instant cash back.',
      subtitleBn: 'অফিসিয়াল ওয়ারেন্টি সহ অরিজিনাল গ্যাজেট কিনুন সবচেয়ে সাশ্রয়ী দামে।',
      buttonText: 'Explore Tech Deals',
      buttonTextBn: 'টেক ডিল দেখুন',
      category: 'Electronics & Gadgets',
      bgGradient: 'from-indigo-950 via-purple-900 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      highlight: '15% Extra Savings (RAMADAN20)',
      couponCode: 'RAMADAN20'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Banner Slider (3 Cols) */}
        <div className={`lg:col-span-3 relative rounded-3xl overflow-hidden bg-gradient-to-r ${active.bgGradient} text-white shadow-xl min-h-[380px] sm:min-h-[420px] flex items-center transition-all duration-700`}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 w-full px-6 sm:px-12 py-8 grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/20">
                {language === 'bn' ? active.badgeBn : active.badge}
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                {language === 'bn' ? active.titleBn : active.title}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-md">
                {language === 'bn' ? active.subtitleBn : active.subtitle}
              </p>

              {/* Coupon chip */}
              <div
                onClick={() => onOpenCoupon(active.couponCode)}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-orange-950/20"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{active.highlight}</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onExplore(active.category)}
                  className="bg-white hover:bg-emerald-50 text-[#0B6623] px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{language === 'bn' ? active.buttonTextBn : active.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Hero Image */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 group">
                <img
                  src={active.imageUrl}
                  alt={active.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {active.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Prev / Next Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side Feature Cards (1 Col) */}
        <div className="flex flex-col gap-3.5 justify-between">
          {/* Card 1: Express Delivery */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200/80 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                {language === 'bn' ? '৬০ মিনিটে এক্সপ্রেস ডেলিভারি' : '60-Minute Fast Delivery'}
              </h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Fulfillment centers across Dhaka ensure hot-stove ingredients arrive when you need them.
              </p>
            </div>
          </div>

          {/* Card 2: 100% Halal Guarantee */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200/80 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 bg-[#0B6623] text-white rounded-xl shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                {language === 'bn' ? '১০০% হালাল ও খাঁটি নিশ্চয়তা' : '100% Halal & Pure Quality'}
              </h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Rigorous inspection by veterinary specialists and certified food safety technicians.
              </p>
            </div>
          </div>

          {/* Card 3: Easy Payments & Cash on Delivery */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200/80 flex items-start gap-3.5 shadow-xs">
            <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-xs shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি ও বিকাশ' : 'bKash, Nagad & Cash on Delivery'}
              </h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Pay on arrival at your doorstep or instant digital verification with zero extra charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
