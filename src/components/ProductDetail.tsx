import React, { useState } from 'react';
import { 
  Heart, ShoppingCart, SlidersHorizontal, Share2, Award, ShieldCheck, 
  Truck, Star, MessageSquare, Plus, ArrowRight, User
} from 'lucide-react';
import { Product, Review, UserProfile } from '../types';

interface ProductDetailProps {
  product: Product;
  user: UserProfile | null;
  isInWishlist: boolean;
  isInCompareList: boolean;
  onToggleWishlist: () => void;
  onToggleCompare: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onBack: () => void;
  onAddReview: (productId: string, review: Review) => void;
}

export default function ProductDetail({
  product,
  user,
  isInWishlist,
  isInCompareList,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onBack,
  onAddReview
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;

  const handleShare = () => {
    const dummyUrl = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(dummyUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Math.floor(1000 + Math.random() * 9000),
      userName: nameInput.trim() || user?.displayName || 'Anonymous Customer',
      rating: ratingInput,
      comment: commentInput.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(product.id, newReview);
    setCommentInput('');
    setNameInput('');
    setShowReviewForm(false);
  };

  return (
    <div id="product-detail-page" className="bg-white min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-brand-red cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Back to Products</span>
        </button>

        {/* Product Showcase & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Media Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 shrink-0 ${
                      activeImage === img ? 'border-brand-red scale-105' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Prices, Actions */}
          <div className="space-y-6">
            
            {/* Category and Stock status */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                product.stockStatus === 'In Stock' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : product.stockStatus === 'Low Stock' 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse' 
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                {product.stockStatus === 'In Stock' ? 'In Stock' : product.stockStatus === 'Low Stock' ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Title & SKU */}
            <div className="space-y-1">
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-950 font-display tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-gray-400 font-mono">SKU ID: {product.sku}</p>
            </div>

            {/* Rating overview */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-400 font-bold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4.5 w-4.5 ${
                      i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700 font-mono">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviews.length} verified customer reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-gray-50 flex items-center justify-between border border-gray-100">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Special Sale Price:</span>
                <div className="flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-extrabold text-brand-red font-mono">Rs {product.discountPrice?.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 line-through font-mono">Rs {product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-gray-950 font-mono">Rs {product.price.toLocaleString()}</span>
                  )}
                </div>
              </div>
              {hasDiscount && (
                <div className="text-right">
                  <span className="text-xs font-bold bg-brand-red text-white px-2.5 py-1 rounded-full uppercase">
                    {Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Product Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={onAddToCart}
                disabled={product.stockStatus === 'Out of Stock'}
                className="w-full py-3.5 px-4 rounded-xl border border-gray-200 hover:border-brand-red text-gray-800 hover:text-brand-red text-sm font-bold flex items-center justify-center gap-2 bg-white transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={onBuyNow}
                disabled={product.stockStatus === 'Out of Stock'}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-red hover:bg-[#CC0000] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-red/10 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Secondary Utilities: Wishlist, Compare, Share */}
            <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleWishlist}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    isInWishlist 
                      ? 'bg-brand-red/10 text-brand-red border-brand-red/20' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={onToggleCompare}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    isInCompareList 
                      ? 'bg-[#1A1A1A] text-white border-black' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>{isInCompareList ? 'Remove from Compare' : 'Compare'}</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-brand-red transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>{shareCopied ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-100 text-center text-[11px] text-gray-500">
              <div className="space-y-1">
                <Award className="h-5 w-5 text-brand-red mx-auto" />
                <p className="font-bold text-gray-800">Company Warranty</p>
                <p>Full coverage included</p>
              </div>
              <div className="space-y-1 border-x border-gray-100">
                <ShieldCheck className="h-5 w-5 text-brand-red mx-auto" />
                <p className="font-bold text-gray-800">100% Authentic Brand</p>
                <p>Genuine solar equipment</p>
              </div>
              <div className="space-y-1">
                <Truck className="h-5 w-5 text-brand-red mx-auto" />
                <p className="font-bold text-gray-800">Secure Delivery</p>
                <p>Fast transit & insurance</p>
              </div>
            </div>

          </div>

        </div>

        {/* Technical Specifications Tab */}
        <div className="pt-12 border-t border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-950 font-display">Technical Specifications</h3>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <tbody>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3.5 font-bold text-[#1A1A1A] w-1/3 border-b border-gray-100 uppercase font-mono tracking-wide">{key}</td>
                    <td className="px-6 py-3.5 text-gray-600 border-b border-gray-100 font-medium font-sans">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="pt-12 border-t border-gray-100 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-red" />
                <span>Customer Feedback</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Real reviews and experiences from our customers.</p>
            </div>
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-brand-red text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add a Review</span>
            </button>
          </div>

          {/* Add Review Form Overlay/Block */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 space-y-4 animate-fadeIn">
              <h4 className="text-sm font-bold text-gray-800">Submit Your Review:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Product Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white focus:border-brand-red"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Your Comment</label>
                <textarea
                  rows={3}
                  required
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your experience about product quality and performance..."
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white focus:border-brand-red"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-red hover:bg-[#CC0000] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-100 rounded-2xl">
              <p className="text-sm text-gray-400">No reviews yet for this product. Be the first to write a review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 border border-gray-50 bg-white rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-brand-red/10 border border-brand-red/20 rounded-full flex items-center justify-center text-brand-red">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-950">{rev.userName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex text-yellow-400 font-bold text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < rev.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
