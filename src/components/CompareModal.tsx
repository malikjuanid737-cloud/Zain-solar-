import React from 'react';
import { Trash2, ShoppingCart, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  compareList: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onClearAll: () => void;
  onBackToHome: () => void;
}

export default function CompareModal({
  compareList,
  onRemoveFromCompare,
  onAddToCart,
  onClearAll,
  onBackToHome
}: CompareModalProps) {
  
  // Extract all unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specifications)))
  );

  return (
    <div id="compare-matrix-page" className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 text-left">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] font-display flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-brand-red" />
              <span>Product Comparison</span>
            </h2>
            <p className="text-xs text-gray-400">Compare technical specifications to find the best solar products for your home.</p>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button 
                onClick={onClearAll}
                className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={onBackToHome}
              className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-brand-red transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl space-y-4">
            <span className="text-5xl block animate-bounce">⚖️</span>
            <h3 className="text-base font-bold text-gray-800">No products selected for comparison!</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Add products like solar panels, inverters, or batteries by clicking the Compare icon on product cards.
            </p>
            <button 
              onClick={onBackToHome}
              className="mt-2 px-5 py-2.5 bg-brand-red text-white text-xs font-bold rounded-full hover:bg-[#CC0000] shadow-md transition-all cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm text-left">
            <table className="w-full text-xs min-w-[650px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-bold text-gray-400 w-1/4 uppercase tracking-wider font-mono">Technical Parameter</th>
                  {compareList.map(product => (
                    <th key={product.id} className="px-6 py-4 relative group">
                      <button 
                        onClick={() => onRemoveFromCompare(product.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="space-y-2 text-center md:text-left">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-20 h-20 object-cover rounded-xl border border-gray-100 mx-auto md:mx-0"
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="font-extrabold text-gray-800 line-clamp-2 h-8 leading-tight">{product.name}</h4>
                        <p className="text-brand-red font-mono font-bold text-sm">
                          Rs {product.discountPrice?.toLocaleString() || product.price.toLocaleString()}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Standard Meta Fields */}
                <tr>
                  <td className="px-6 py-4 font-bold text-[#1A1A1A] bg-gray-50/50 uppercase font-mono tracking-wider">Category</td>
                  {compareList.map(p => (
                    <td key={p.id} className="px-6 py-4 font-medium text-gray-600">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-[#1A1A1A] bg-gray-50/50 uppercase font-mono tracking-wider">Stock Status</td>
                  {compareList.map(p => (
                    <td key={p.id} className="px-6 py-4 font-medium">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stockStatus === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.stockStatus}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-[#1A1A1A] bg-gray-50/50 uppercase font-mono tracking-wider">Rating</td>
                  {compareList.map(p => (
                    <td key={p.id} className="px-6 py-4 font-medium text-gray-700">
                      ⭐ {p.rating.toFixed(1)} <span className="text-gray-400 text-[10px]">({p.reviews.length})</span>
                    </td>
                  ))}
                </tr>

                {/* Dynamic Spec Keys */}
                {allSpecKeys.map(key => (
                  <tr key={key}>
                    <td className="px-6 py-4 font-bold text-[#1A1A1A] bg-gray-50/50 uppercase font-mono tracking-wider">{key}</td>
                    {compareList.map(p => (
                      <td key={p.id} className="px-6 py-4 text-gray-600 font-medium">
                        {p.specifications[key] || <span className="text-gray-300">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Direct Order Actions */}
                <tr className="bg-gray-50/20 text-center">
                  <td className="px-6 py-6"></td>
                  {compareList.map(product => (
                    <td key={product.id} className="px-6 py-6">
                      <button 
                        onClick={() => onAddToCart(product)}
                        disabled={product.stockStatus === 'Out of Stock'}
                        className="w-full py-2 px-4 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
