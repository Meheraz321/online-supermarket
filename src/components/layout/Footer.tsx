import React, { useState } from 'react';
import {
  ShoppingBag,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Send,
  Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onSelectCategory: (name: string) => void;
  onOpenTracking: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onOpenRider: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracking,
  onOpenSupport,
  onOpenAdmin,
  onOpenRider
}) => {
  const { language } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-gray-300 pt-12 pb-8 border-t border-slate-900 mt-12">
      {/* 4 Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">60-Min Instant Delivery</h4>
              <p className="text-gray-400 mt-0.5">Express delivery from nearby local hubs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950 text-orange-400 border border-orange-800/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Halal &amp; Authentic</h4>
              <p className="text-gray-400 mt-0.5">Verified food safety &amp; freshness</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/50 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Doorstep Return Policy</h4>
              <p className="text-gray-400 mt-0.5">Instant check &amp; refund on spot</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Nationwide Coverage</h4>
              <p className="text-gray-400 mt-0.5">Dhaka, Ctg, Sylhet, Rajshahi, Khulna</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0B6623] flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-white">SUPER</span>
              <span className="text-2xl font-black tracking-tight text-orange-500">MART</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            Bangladesh's premier multi-category online supermarket platform. Offering over 10,000+ items across groceries, farm produce, meat, fish, dairy, baby care, fashion, and home essentials.
          </p>

          <div className="space-y-1.5 text-gray-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Concord Tower, Level 8, Gulshan 1, Dhaka-1212</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Customer Helpline: 16999 (24/7)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Corporate Inquiries: contact@supermart.bd</span>
            </p>
          </div>
        </div>

        {/* Supermarket Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Departments</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button
                onClick={() => onSelectCategory('Fruits & Vegetables')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                Fresh Produce &amp; Greens
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Meat & Seafood')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                Padma Hilsa &amp; Halal Meat
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Grocery & Daily Essentials')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                Rice, Oils &amp; Spices
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Dairy & Bakery')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                Dairy Milk, Butter &amp; Bread
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Electronics & Gadgets')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                Smartphones &amp; Audio
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Service & Portals */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button onClick={onOpenTracking} className="hover:text-emerald-400 transition cursor-pointer">
                Live Order Tracking
              </button>
            </li>
            <li>
              <button onClick={onOpenSupport} className="hover:text-emerald-400 transition cursor-pointer">
                Help Center &amp; Support Tickets
              </button>
            </li>
            <li>
              <button onClick={onOpenAdmin} className="text-purple-400 hover:text-purple-300 transition cursor-pointer font-semibold">
                Super Admin Portal
              </button>
            </li>
            <li>
              <button onClick={onOpenRider} className="text-orange-400 hover:text-orange-300 transition cursor-pointer font-semibold">
                Delivery Agent Dashboard
              </button>
            </li>
            <li>
              <span className="text-gray-500">VAT Reg: 002918847-0102</span>
            </li>
          </ul>
        </div>

        {/* Newsletter & Payments */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Super Deals</h4>
          <p className="text-gray-400 text-xs">
            Subscribe for exclusive coupon codes, flash discounts, and seasonal fresh arrivals.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-[#0B6623]"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-[#0B6623] hover:bg-emerald-800 text-white p-1 rounded-lg transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {newsletterSubscribed && (
              <p className="text-[11px] text-emerald-400 font-semibold">
                Thanks for subscribing to Super Mart alerts!
              </p>
            )}
          </form>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-gray-400 block mb-2">Accepted Payment Methods:</span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-gray-300">
              <span className="bg-pink-900/60 text-pink-300 px-2 py-1 rounded border border-pink-700/40">bKash</span>
              <span className="bg-orange-900/60 text-orange-300 px-2 py-1 rounded border border-orange-700/40">Nagad</span>
              <span className="bg-purple-900/60 text-purple-300 px-2 py-1 rounded border border-purple-700/40">Rocket</span>
              <span className="bg-slate-800 text-gray-300 px-2 py-1 rounded border border-slate-700">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8 mt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
        <p>&copy; {new Date().getFullYear()} SUPER MART Online Supermarket. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with excellence for super fast grocery shopping across Bangladesh.
        </p>
      </div>
    </footer>
  );
};
