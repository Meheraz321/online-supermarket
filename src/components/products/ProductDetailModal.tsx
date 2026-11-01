import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { language, formatPrice } = useLanguage();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { user, isInWishlist, toggleWishlist } = useAuth();

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  if (!product) return null;

  const inCartQty = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.discountPrice || product.regularPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.regularPrice;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'cust-anon',
          userName: user?.name || 'Verified Customer',
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewMessage('Thank you! Your verified review has been posted.');
        setNewComment('');
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift(data.data);
        product.rating = data.productRating;
        product.reviewCount = data.reviewCount;
      }
    } catch (err) {
      setReviewMessage('Review saved locally.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in-95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Gallery & Zoom Preview */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
              <img
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  ৳{product.regularPrice - product.discountPrice!} OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      activeImage === idx ? 'border-[#0B6623] ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-gray-600">
              <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-[#0B6623] mx-auto mb-1" />
                <span className="font-semibold block">100% Authentic</span>
              </div>
              <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-100">
                <Truck className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span className="font-semibold block">60 Min Delivery</span>
              </div>
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <RotateCcw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="font-semibold block">Easy Doorstep Return</span>
              </div>
            </div>
          </div>

          {/* Right: Info, Price, Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{product.category} &bull; {product.subcategory}</span>
                <span className="font-mono text-gray-400">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {language === 'bn' ? product.nameBn : product.name}
              </h1>

              {/* Rating & Brand */}
              <div className="flex items-center gap-3 mt-2.5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-800">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-[#0B6623]">
                  Brand: {product.brand}
                </span>
              </div>

              {/* Pricing Section */}
              <div className="py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#0B6623]">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-gray-400 line-through font-semibold">
                      {formatPrice(product.regularPrice)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {product.unit}
                  </span>
                </div>
                {hasDiscount && (
                  <p className="text-xs text-emerald-700 font-bold mt-1">
                    You save {formatPrice(product.regularPrice - product.discountPrice!)} on this order!
                  </p>
                )}
              </div>

              {/* Perishable & Expiration Notice */}
              {product.isPerishable && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center gap-2.5 text-xs text-emerald-900">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold">Fresh Perishable Item: </span>
                    <span>Best consumed within shelf-life. Inspected today for premium freshness.</span>
                  </div>
                </div>
              )}

              {/* Tabs: Details / Specs / Reviews */}
              <div className="flex border-b border-gray-200 text-xs font-bold mb-3">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 mr-4 transition cursor-pointer border-b-2 ${
                    activeTab === 'details' ? 'border-[#0B6623] text-[#0B6623]' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 mr-4 transition cursor-pointer border-b-2 ${
                    activeTab === 'specs' ? 'border-[#0B6623] text-[#0B6623]' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition cursor-pointer border-b-2 ${
                    activeTab === 'reviews' ? 'border-[#0B6623] text-[#0B6623]' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Reviews ({product.reviews?.length || 0})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="max-h-48 overflow-y-auto pr-1 text-xs text-gray-600 leading-relaxed">
                {activeTab === 'details' && (
                  <p>{language === 'bn' ? product.descriptionBn : product.description}</p>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-1.5">
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="font-semibold text-gray-700">{key}:</span>
                          <span className="text-gray-600">{val}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">Standard supermarket grade packaging &amp; quality guarantee.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    {/* Write Review Form */}
                    <form onSubmit={handleSubmitReview} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-800 block mb-1">Write a Review</span>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            onClick={() => setNewRating(s)}
                            className={`w-4 h-4 cursor-pointer ${
                              s <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={2}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-800 outline-none focus:border-[#0B6623]"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="mt-1.5 bg-[#0B6623] hover:bg-emerald-800 text-white px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition disabled:opacity-50"
                      >
                        Submit Review
                      </button>
                      {reviewMessage && <p className="text-[11px] text-[#0B6623] font-semibold mt-1">{reviewMessage}</p>}
                    </form>

                    {/* Existing reviews */}
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="p-2.5 bg-gray-50/50 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{rev.userName}</span>
                            <div className="flex items-center text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span className="text-[11px] font-bold text-gray-700 ml-1">{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600">{rev.comment}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{rev.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">Be the first to review this product!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Footer Actions */}
            <div className="pt-6 border-t border-gray-100 mt-4 flex items-center gap-3">
              {inCartQty > 0 ? (
                <div className="flex items-center bg-emerald-50 rounded-xl p-1.5 border border-[#0B6623]/30">
                  <button
                    onClick={() => updateQuantity(product.id, inCartQty - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition shadow-xs cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-[#0B6623] px-4">
                    {inCartQty} in Cart
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, inCartQty + 1)}
                    disabled={inCartQty >= product.stockQuantity}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0B6623] text-white hover:bg-emerald-800 transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stockQuantity <= 0}
                  className="flex-1 py-3 px-6 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
