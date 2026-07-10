import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Load user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Handle clicking outside of the search dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic to prevent spamming the backend
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/50 px-6 py-4 shadow-xs">
      <div className="max-w-6xl mx-auto flex justify-between items-center w-full gap-6">
        
{/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#863bff] tracking-tight hover:opacity-90 transition-opacity">DigiStore</Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-500">
            <Link to="/" className={`pb-1 transition-colors ${isActive('/') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>خانه</Link>
            <Link to="/marketplace" className={`pb-1 transition-colors ${isActive('/marketplace') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>بازارچه محصولات</Link>
            {user && user.role === 'SELLER' && (
              <Link to="/seller/dashboard" className={`pb-1 transition-colors ${isActive('/seller/dashboard') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>پنل فروشندگان</Link>
            )}
          </nav>
        </div>

        {/* Global Search Bar with Dropdown */}
        <div className="hidden md:block flex-1 max-w-md relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery.trim().length > 0) setShowDropdown(true) }}
              className="w-full py-2.5 pr-10 pl-4 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-[#6320ee] transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>

          {showDropdown && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg shadow-purple-100/50 overflow-hidden flex flex-col z-50">
              {isSearching ? (
                <div className="p-4 text-center text-xs font-bold text-gray-400">در حال جستجو...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                      className="p-3 border-b border-gray-50 hover:bg-purple-50 transition-colors flex flex-col gap-1"
                    >
                      <span className="text-xs font-black text-gray-900 line-clamp-1">{product.title}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-500 font-medium">فروشنده: {product.seller?.fullName || 'ناشناس'}</span>
                        <span className="text-[10px] font-black text-[#6d28d9]">{product.price.toLocaleString('en-US')} تومان</span>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-xs font-bold text-gray-400">محصولی با این نام پیدا نشد!</div>
              )}
            </div>
          )}
        </div>

        {/* User Account Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3.5 border border-purple-100/80 bg-gradient-to-r from-purple-50/40 to-indigo-50/40 p-1.5 pr-4 rounded-2xl shadow-xs">
              <div className="flex flex-col text-right">
                <span className="text-sm font-black text-gray-900">{user.fullName}</span>
                <span className="text-[11px] font-bold text-purple-600 tracking-wide">
                  {user.role === 'BUYER' ? 'خریدار' : user.role === 'SELLER' ? 'فروشنده / مدرس' : 'مدیر سیستم'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6320ee] to-[#863bff] text-white font-black text-sm flex justify-center items-center shadow-sm">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <button 
                onClick={handleLogout}
                className="mr-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-sm cursor-pointer"
                title="خروج از حساب"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-black text-gray-600 hover:text-[#6d28d9] transition-colors px-2 py-1">ورود</Link>
              <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-[#6320ee] to-[#7c3aed] hover:shadow-lg hover:shadow-purple-100 text-white text-sm font-black rounded-xl transition-all">ثبت نام رایگان</Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}