import React from 'react';
import { Heart, Plus, Minus, Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  isFlashCard?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  isFlashCard = false
}) => {
  const { language, formatPrice } = useLanguage();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();

  const quantityInCart = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.discountPrice || product.regularPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.discountPrice!) / product.regularPrice) * 100)
    : 0;

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${
        isFlashCard
          ? 'border-orange-200 text-gray-900'
          : 'border-gray-100 hover:border-emerald-300'
      }`}
    >
      {/* Top Media Area */}
      <div className="relative pt-[85%] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => onOpenModal(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge && (
            <span className="bg-[#0B6623] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="line-clamp-1">{product.brand}</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-600 font-medium">
              {product.unit}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenModal(product)}
            className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0B6623] line-clamp-2 cursor-pointer leading-snug transition-colors"
          >
            {language === 'bn' ? product.nameBn : product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Bottom Pricing & Actions */}
        <div className="mt-3 pt-2.5 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm sm:text-base font-black text-[#0B6623]">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          {/* Stock alert */}
          {isLowStock && (
            <p className="text-[10px] text-orange-600 font-semibold mb-2">
              Only {product.stockQuantity} left in stock!
            </p>
          )}

          {/* Cart Quantity Action */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-1 border border-[#0B6623]/30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, quantityInCart - 1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-[#0B6623] px-2">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, quantityInCart + 1);
                }}
                disabled={quantityInCart >= product.stockQuantity}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0B6623] text-white hover:bg-emerald-800 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-[#0B6623] text-[#0B6623] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs group/btn"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#0B6623] group-hover/btn:text-white transition-colors" />
              <span>{language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
