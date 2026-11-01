import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, DeliveryZone } from '../types';
import { DELIVERY_ZONES_DATA, COUPONS_DATA } from '../data/seedData';

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalItemCount: number;
  freeDeliveryThreshold: number;
  remainingForFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sm_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES_DATA[0]);

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stockQuantity, existing.quantity + quantity);
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { product, quantity: Math.min(product.stockQuantity, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stockQuantity, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.regularPrice;
    return sum + price * item.quantity;
  }, 0);

  const freeDeliveryThreshold = 1500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryFee = subtotal >= freeDeliveryThreshold || items.length === 0 ? 0 : selectedZone.baseCharge;

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, cartTotal: subtotal })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon({
          code: cleanCode,
          discountAmount: data.data.discountAmount,
          description: data.data.description
        });
        return { success: true, message: `Promo code ${cleanCode} applied! Saved ৳${data.data.discountAmount}` };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }
    } catch (err) {
      // Offline fallback
      const found = COUPONS_DATA.find(c => c.code.toUpperCase() === cleanCode);
      if (!found) {
        return { success: false, message: 'Invalid promo code' };
      }
      if (subtotal < found.minSpend) {
        return { success: false, message: `Minimum order ৳${found.minSpend} required for this coupon` };
      }
      let disc = found.discountFlat || 0;
      if (found.discountPercent) {
        disc = (subtotal * found.discountPercent) / 100;
        if (found.maxDiscount && disc > found.maxDiscount) disc = found.maxDiscount;
      }
      setAppliedCoupon({
        code: cleanCode,
        discountAmount: Math.round(disc),
        description: found.description
      });
      return { success: true, message: `Applied ${cleanCode}! Saved ৳${Math.round(disc)}` };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedZone,
        setSelectedZone,
        subtotal,
        discount,
        deliveryFee,
        total,
        totalItemCount,
        freeDeliveryThreshold,
        remainingForFreeDelivery
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
