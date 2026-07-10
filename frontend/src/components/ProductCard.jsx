import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  return (
    // Wrap the entire card in a Link component to enable navigation
    <Link to={`/product/${item.id}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full text-right cursor-pointer">
        
        {/* Top visual banner section */}
        <div className="h-40 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 flex flex-col justify-between relative">
          <span className="self-start text-[10px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-md">
            محصول دیجیتال
          </span>
        </div>

        {/* Text content and pricing section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 h-10">{item.title}</h3>
            {/* Display the seller's name if available, otherwise show a default text */}
            <p className="text-xs text-gray-400 mb-2">فروشنده: {item.seller?.fullName || 'ناشناس'}</p>
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