import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatPrice: (amount: number) => string;
}

const translations: Record<string, { en: string; bn: string }> = {
  appName: { en: 'SUPER MART', bn: 'সুপার মার্ট' },
  tagline: { en: 'Online Supermarket & Fresh Groceries', bn: 'অনলাইন সুপারমার্কেট ও কাঁচাবাজার' },
  searchPlaceholder: { en: 'Search 10,000+ items (Rice, Fish, Milk, Oil, Gadgets...)', bn: '১০,০০০+ পণ্য খুঁজুন (চাল, মাছ, দুধ, তেল, গ্যাজেটস...)' },
  allCategories: { en: 'All Categories', bn: 'সকল ক্যাটাগরি' },
  flashSale: { en: 'Flash Sale', bn: 'ফ্ল্যাশ সেল' },
  todaysDeals: { en: "Today's Super Deals", bn: 'আজকের সুপার অফার' },
  bestSellers: { en: 'Best Selling Items', bn: 'সেরা বিক্রিত পণ্য' },
  freshProduce: { en: 'Fresh Farm Produce', bn: 'খামার থেকে তাজা পণ্য' },
  meatFish: { en: 'Fresh Meat & River Fish', bn: 'টাটকা মাছ ও হালাল মাংস' },
  addToCart: { en: 'Add to Cart', bn: 'কার্টে যোগ করুন' },
  added: { en: 'Added', bn: 'যোগ হয়েছে' },
  outOfStock: { en: 'Out of Stock', bn: 'স্টক শেষ' },
  inStock: { en: 'In Stock', bn: 'স্টকে আছে' },
  viewDetails: { en: 'Quick View', bn: 'বিস্তারিত দেখুন' },
  cart: { en: 'Cart', bn: 'কার্ট' },
  checkout: { en: 'Proceed to Checkout', bn: 'চেকআউট করুন' },
  subtotal: { en: 'Subtotal', bn: 'মোট মূল্য' },
  discount: { en: 'Discount', bn: 'ছাড়' },
  deliveryFee: { en: 'Delivery Fee', bn: 'ডেলিভারি চার্জ' },
  total: { en: 'Total Payable', bn: 'সর্বমোট প্রদেয়' },
  applyCoupon: { en: 'Apply Promo Code', bn: 'কুপন কোড দিন' },
  expressDelivery: { en: '60 Min Express Delivery', bn: '৬০ মিনিটে সুপারফাস্ট ডেলিভারি' },
  orderTracking: { en: 'Track Order', bn: 'অর্ডার ট্র্যাক' },
  myOrders: { en: 'My Orders', bn: 'আমার অর্ডার' },
  adminDashboard: { en: 'Admin Panel', bn: 'অ্যাডমিন প্যানেল' },
  riderDashboard: { en: 'Delivery Rider', bn: 'রাইডার ড্যাশবোর্ড' },
  login: { en: 'Login / Register', bn: 'লগইন / সাইন আপ' },
  logout: { en: 'Sign Out', bn: 'লগআউট' },
  reviews: { en: 'Customer Reviews', bn: 'গ্রাহক রিভিউ' },
  perishableAlert: { en: 'Fresh Guarantee', bn: 'তাজা পণ্যের গ্যারান্টি' },
  freeDeliveryMsg: { en: 'Free delivery on orders over ৳1,500', bn: '১,৫০০ টাকার অর্ডারে ফ্রি ডেলিভারি!' },
  switchLanguage: { en: 'বাংলা', bn: 'English' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sm_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sm_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  const toBanglaDigits = (num: number | string): string => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, d => banglaDigits[Number(d)]);
  };

  const formatPrice = (amount: number): string => {
    if (language === 'bn') {
      return `৳${toBanglaDigits(amount.toLocaleString('en-US'))}`;
    }
    return `৳${amount.toLocaleString('en-US')}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
