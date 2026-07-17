import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  // "Course" products show a student count, everything else shows a buyer count
  const buyerLabel = item.category === 'Course' ? 'دانشجو' : 'خریدار';
  const purchaseCount = item.purchaseCount ?? 0;
  const averageRating = item.averageRating ?? 0;
  const reviewCount = item.reviewCount ?? 0;

  return (
    // Wrap the entire card in a Link component to enable navigation
    <Link to={`/product/${item.id}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full text-right cursor-pointer">
        
        {/* Top visual banner section */}
        <div className="h-40 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 flex flex-col justify-between relative">
          <span className="self-start text-[10px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md">
            محصول دیجیتال
          </span>

          {/* Rating badge, only shown once the product has at least one review */}
          {reviewCount > 0 && (
            <span className="self-start text-[10px] font-black bg-white/90 backdrop-blur-md text-amber-600 px-2 py-1 rounded-md flex items-center gap-1">
              ⭐ {averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Text content and pricing section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 h-10">{item.title}</h3>
            {/* Display the seller's name if available, otherwise show a default text */}
            <p className="text-xs text-gray-400 mb-2">فروشنده: {item.seller?.fullName || 'ناشناس'}</p>

            {/* Social proof row: rating + student/buyer count */}
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-amber-500">⭐</span>
                {averageRating.toFixed(1)}
                <span className="text-gray-400 font-medium">({reviewCount})</span>
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1">
                <span>👥</span>
                {purchaseCount.toLocaleString('en-US')} {buyerLabel}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
            <div className="text-sm font-black text-[#6d28d9]">
              {item.price.toLocaleString('en-US')} <span className="text-[10px] font-normal text-gray-400">تومان</span>
            </div>
            <button className="text-xs font-bold text-gray-500 hover:text-[#6d28d9] transition-colors">مشاهده</button>
          </div>
        </div>

      </div>
    </Link>
  );
}