import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // live search functionality with debounce
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?search=${searchQuery}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-white/80 backdrop-blur-md text-[#6d28d9] border border-purple-100/80 px-4 py-2 rounded-full mb-8 shadow-xs">
          🏪 بازارچه هوشمند دوره‌های آموزشی، لایسنس اپلیکیشن و فایل‌های تخصصی
        </span>
        
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-950 tracking-tight">
          هر محصول دیجیتالی که نیاز دارید،<br />
          <span className="bg-gradient-to-r from-[#6d28d9] via-[#863bff] to-[#3b82f6] bg-clip-text text-transparent">یکجا و با تحویل آنی</span> پیدا کنید
        </h1>
        
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed mb-10 font-medium">
          از دوره‌های پیشرفته و کتاب‌های علمی تا لایسنس ابزارها و اشتراک اپلیکیشن‌های بین‌المللی؛ مستقیم و بدون واسطه از فروشندگان تخصصی خرید کنید.
        </p>

        {/* Search Bar & Dropdown Container */}
        <div className="max-w-md mx-auto relative shadow-xl shadow-purple-100/30 rounded-2xl z-50" ref={dropdownRef}>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="جستجوی دوره، کتاب، لایسنس اپلیکیشن..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery.trim().length > 0) setShowDropdown(true) }}
              className="w-full p-4.5 pr-12 rounded-2xl bg-white border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6320ee] focus:ring-4 focus:ring-purple-100/40 transition-all text-xs font-bold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-[#6320ee] transition-colors">🔍</span>
          </div>

          {/* Live Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-purple-100/50 overflow-hidden flex flex-col z-50 text-right">
              {isSearching ? (
                <div className="p-5 text-center text-xs font-bold text-gray-400">در حال جستجوی بازارچه...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                      className="p-4 border-b border-gray-50 hover:bg-purple-50/60 transition-colors flex flex-col gap-1.5"
                    >
                      <span className="text-sm font-black text-gray-900 line-clamp-1">{product.title}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[11px] text-gray-400 font-medium">فروشنده: {product.seller?.fullName || 'ناشناس'}</span>
                        <span className="text-[11px] font-black text-[#6d28d9]">{product.price.toLocaleString('en-US')} تومان</span>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="p-5 text-center text-xs font-bold text-gray-400">محصولی با این مشخصات یافت نشد!</div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}