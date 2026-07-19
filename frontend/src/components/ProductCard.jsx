import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  const buyerLabel = item.category === 'Course' ? 'دانشجو' : 'خریدار';
  const purchaseCount = item.purchaseCount ?? 0;
  const averageRating = item.averageRating ?? 0;
  const reviewCount = item.reviewCount ?? 0;

  return (
    <Link to={`/product/${item.id}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full text-right cursor-pointer">
        
        <div className="h-40 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 flex flex-col justify-between relative">
          <div className="flex flex-col gap-2 self-start items-start">
            {/* Dynamic Category Badge */}
            <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md shadow-sm">
              {item.category === 'Course' ? '📚 دوره آموزشی' : item.category === 'Book' ? '📄 کتاب / PDF' : '🔑 لایسنس نرم‌افزار'}
            </span>
            
            {/* DigiCourse Badge */}
            {item.allowSubscription && (
              <span className="text-[10px] font-black bg-gradient-to-r from-emerald-400 to-green-500 shadow-md text-white px-2 py-1 rounded-md flex items-center gap-1 border border-green-400/50">
                ✨ قابل دریافت با دیجی‌کورس
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 h-10">{item.title}</h3>
            <p className="text-xs text-gray-400 mb-2">فروشنده: {item.seller?.fullName || 'ناشناس'}</p>

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