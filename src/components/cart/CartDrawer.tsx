import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    total,
    totalItemCount,
    freeDeliveryThreshold,
    remainingForFreeDelivery
  } = useCart();

  const { language, formatPrice } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    setIsApplying(true);
    setCouponFeedback(null);
    const result = await applyCoupon(code);
    setIsApplying(false);
    setCouponFeedback({
      msg: result.message,
      isError: !result.success
    });
    if (result.success) {
      setCouponInput('');
    }
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0B6623] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base">
                {language === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Shopping Cart'}
              </h2>
              <span className="text-xs text-gray-400">
                {totalItemCount} {language === 'bn' ? 'টি পণ্য' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0B6623]" />
              {remainingForFreeDelivery === 0
                ? '🎉 Congratulations! You unlocked FREE Delivery!'
                : `Add ${formatPrice(remainingForFreeDelivery)} more for FREE Delivery`}
            </span>
            <span className="text-[11px] font-bold text-[#0B6623]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B6623] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Your cart is empty</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Explore our supermarket fresh groceries and daily essentials to fill your basket.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 bg-[#0B6623] hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition cursor-pointer shadow-md"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const price = product.discountPrice || product.regularPrice;
              return (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {language === 'bn' ? product.nameBn : product.name}
                    </h4>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {product.unit} • {formatPrice(price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockQuantity}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-gray-900 block">
                      {formatPrice(price * quantity)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 space-y-3.5">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#0B6623]" />
                    <span>Coupon {appliedCoupon.code} Applied (-{formatPrice(appliedCoupon.discountAmount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code (e.g. SUPER100)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs uppercase font-mono tracking-wider outline-none focus:border-[#0B6623]"
                      />
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => handleApplyCoupon()}
                      disabled={isApplying || !couponInput.trim()}
                      className="px-4 py-2 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  {/* Quick Coupon Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-gray-400 font-medium">Try:</span>
                    {['SUPER100', 'RAMADAN20', 'FRESH50'].map((code) => (
                      <button
                        key={code}
                        onClick={() => handleApplyCoupon(code)}
                        className="px-1.5 py-0.5 bg-white border border-gray-200 hover:border-emerald-500 rounded text-[10px] font-mono text-emerald-800 cursor-pointer transition"
                      >
                        {code}
                      </button>
                    ))}
                  </div>

                  {couponFeedback && (
                    <p className={`text-[11px] font-semibold ${couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                      {couponFeedback.msg}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200/80 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-[#0B6623] uppercase text-[11px]">Free</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Payable</span>
                <span className="text-[#0B6623]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-3.5 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
