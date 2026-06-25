import React from 'react';
import { Heart, ShoppingCart, SlidersHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  isInWishlist: boolean;
  isInCompareList: boolean;
  onToggleWishlist: () => void;
  onToggleCompare: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onViewDetails: () => void;
}

export default function ProductCard({
  product,
  isInWishlist,
  isInCompareList,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onViewDetails
}: ProductCardProps) {
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div 
      id={`product-card-${product.id}`} 
      className="group relative flex flex-col bg-white border border-gray-100 hover:border-brand-red/20 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
    >
      
      {/* Badges and actions on image hover */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          onClick={onViewDetails}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          referrerPolicy="no-referrer"
        />

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {product.category}
        </span>

        {/* Stock status badge */}
        <span className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
          product.stockStatus === 'In Stock' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : product.stockStatus === 'Low Stock' 
            ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse' 
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {product.stockStatus === 'In Stock' ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          <span>{product.stockStatus === 'In Stock' ? 'In Stock' : product.stockStatus === 'Low Stock' ? 'Low Stock' : 'Out of Stock'}</span>
        </span>

        {/* Floating actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`p-2.5 rounded-xl border shadow-md transition-all ${
              isInWishlist 
                ? 'bg-brand-red text-white border-brand-red scale-110' 
                : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
            }`}
            title="Add to Wishlist"
          >
            <Heart className="h-4 w-4 fill-current" />
          </button>

          {/* Compare button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`p-2.5 rounded-xl border shadow-md transition-all ${
              isInCompareList 
                ? 'bg-[#1A1A1A] text-white border-black scale-110' 
                : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
            }`}
            title="Compare"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col p-4">
        
        {/* Rating and SKU */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500 mb-1">
          <span className="font-mono text-gray-400">SKU: {product.sku}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 font-bold">★</span>
            <span className="font-bold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400">({product.reviews.length})</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={onViewDetails}
          className="text-sm font-semibold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-tight cursor-pointer mb-2 h-10"
        >
          {product.name}
        </h3>

        {/* Product description snippet */}
        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Price Tag */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-baseline justify-between gap-2 flex-wrap">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-gray-400 line-through">Rs {product.price.toLocaleString()}</span>
                <span className="text-base font-extrabold text-brand-red">Rs {product.discountPrice?.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-base font-extrabold text-gray-900">Rs {product.price.toLocaleString()}</span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-[10px] font-extrabold bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded">
              {Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onAddToCart}
            disabled={product.stockStatus === 'Out of Stock'}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 hover:border-brand-red hover:text-brand-red text-gray-700 bg-white transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={onBuyNow}
            disabled={product.stockStatus === 'Out of Stock'}
            className="flex items-center justify-center py-2 px-3 text-xs font-bold rounded-lg bg-brand-red text-white hover:bg-[#CC0000] shadow-sm hover:shadow-brand-red/10 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <span>Buy Now</span>
          </button>
        </div>

      </div>

    </div>
  );
}
