import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  
  // استیت‌های مربوط به دیجی‌کورس
  const [plans, setPlans] = useState([]);
  const [isDigiCourseOpen, setIsDigiCourseOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const digiCourseRef = useRef(null); // رفرنس برای دراپ‌داون دیجی‌کورس

  // اضافه کردن addToCart به کانتکست
  const { cart, getCartTotal, removeFromCart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  // فچ کردن پلن‌های دیجی‌کورس از بک‌اند
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/plans`);
        if (res.ok) {
          const data = await res.json();
          // فقط پلن‌های فعال را نشان می‌دهیم
          setPlans(data.filter(plan => plan.isActive));
        }
      } catch (err) { 
        console.error('Error fetching subscription plans:', err); 
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  // هندلر اضافه کردن پلن به سبد خرید
  const handleAddPlanToCart = (plan) => {
    addToCart({
      id: plan.id,
      title: `اشتراک دیجی‌کورس - ${plan.title}`,
      price: plan.price,
      type: 'SUBSCRIPTION', // مشخص کردن تایپ برای بک‌اند
      category: 'اشتراک VIP'
    });
    setIsDigiCourseOpen(false);
    navigate('/cart'); // انتقال خودکار به سبد خرید پس از انتخاب پلن
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsSearchBarOpen(false);
      }
      // بستن دراپ‌داون دیجی‌کورس در صورت کلیک بیرون از آن
      if (digiCourseRef.current && !digiCourseRef.current.contains(event.target)) {
        setIsDigiCourseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-purple-100/60 px-4 md:px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center w-full gap-4">
        
        {/* Right Section: Mobile Menu Trigger Icon Button & Logo */}
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#6d28d9] hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#863bff] tracking-tight hover:opacity-90 transition-opacity">
            DigiStore
          </Link>

          {/* Desktop Core Route Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-500">
            <Link to="/" className={`pb-1 transition-all duration-200 ${isActive('/') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>خانه</Link>
            <Link to="/marketplace" className={`pb-1 transition-all duration-200 ${isActive('/marketplace') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>بازارچه محصولات</Link>
            
            {/* دراپ‌داون دیجی‌کورس */}
            <div className="relative" ref={digiCourseRef}>
              <button 
                onClick={() => setIsDigiCourseOpen(!isDigiCourseOpen)} 
                className="flex items-center gap-1 text-[#6d28d9] hover:text-purple-800 transition-colors cursor-pointer pb-1 font-bold"
              >
                <span>خرید دیجی‌کورس</span>
                <span className="text-[10px]">▼</span>
              </button>
              
              {isDigiCourseOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-purple-100 shadow-2xl rounded-2xl p-2 z-50 flex flex-col gap-1">
                  {plans.length > 0 ? plans.map(plan => (
                    <button 
                      key={plan.id} 
                      onClick={() => handleAddPlanToCart(plan)}
                      className="text-right p-3 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="text-sm font-black text-gray-900">{plan.title}</div>
                      <div className="text-xs font-bold text-purple-600 mt-1">{plan.price.toLocaleString('fa-IR')} تومان</div>
                    </button>
                  )) : (
                    <div className="p-3 text-xs text-gray-500 text-center font-bold">پلنی یافت نشد</div>
                  )}
                </div>
              )}
            </div>

            {user && user.role === 'SELLER' && (
              <Link to="/seller/dashboard" className={`pb-1 transition-all duration-200 ${isActive('/seller/dashboard') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>پنل فروشندگان</Link>
            )}
            {user && user.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className={`pb-1 transition-all duration-200 ${isActive('/admin/dashboard') ? 'text-[#6d28d9] border-b-2 border-[#6d28d9]' : 'hover:text-[#6d28d9]'}`}>پنل مدیریت ادمین</Link>
            )}
          </nav>
        </div>

        {/* Center Section: Desktop Live Search Layout Component */}
        <div className="hidden md:block flex-1 max-w-sm relative" ref={dropdownRef}>
          <div className="relative group">
            <input
              type="text"
              placeholder="جستجوی محصول، دوره، لایسنس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery.trim().length > 0) setShowDropdown(true) }}
              className="w-full py-2.5 pr-10 pl-4 bg-gray-50/60 border border-gray-200 focus:border-[#6320ee] rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-100/40 transition-all duration-200"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-[#6320ee] transition-colors">🔍</span>
          </div>

          {showDropdown && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl shadow-purple-100/40 overflow-hidden flex flex-col z-50">
              {isSearching ? (
                <div className="p-4 text-center text-xs font-bold text-gray-400">در حال جستجو...</div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                      className="p-3 border-b border-gray-50 hover:bg-purple-50/60 transition-colors flex flex-col gap-1 text-right"
                    >
                      <span className="text-xs font-black text-gray-900 line-clamp-1">{product.title}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-400 font-medium">فروشنده: {product.seller?.fullName || 'ناشناس'}</span>
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

        {/* Left Section: Context Responsive Auth Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#6d28d9] hover:bg-purple-50 rounded-xl transition-all"
            aria-label="Open Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart Dropdown Module - Now visible on mobile */}
          <div className="relative group">
            <Link to="/cart" className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50/50 hover:bg-purple-100 text-[#6d28d9] transition-all relative">
              <span className="text-lg">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Hover Dropdown Interface - Hidden on mobile, visible on sm desktop and up */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible sm:group-hover:opacity-100 sm:group-hover:visible transition-all duration-300 transform origin-top-left z-50 text-right hidden sm:flex flex-col">
              <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                <span className="text-xs font-black text-gray-900">سبد خرید شما</span>
                <span className="text-[10px] font-bold text-gray-400">{cart.length} محصول</span>
              </div>
              
              <div className="max-h-60 overflow-y-auto p-2">
                {cart.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 font-bold py-6">سبد خرید خالی است.</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={item.id + index} className="flex justify-between items-center p-2 hover:bg-purple-50 rounded-xl transition-colors group/item">
                      <div className="flex flex-col truncate ml-2">
                        <span className="text-xs font-black text-gray-900 truncate">{item.title}</span>
                        <span className="text-[10px] font-bold text-[#6d28d9] mt-0.5">{item.price.toLocaleString('en-US')} تومان</span>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }} className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover/item:opacity-100 transition-opacity p-1 cursor-pointer">
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-3 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-gray-500">جمع کل:</span>
                    <span className="text-xs font-black text-gray-900">{getCartTotal().toLocaleString('en-US')} تومان</span>
                  </div>
                  <Link to="/cart" className="block w-full py-2.5 text-center bg-[#6320ee] hover:bg-[#521ac4] text-white text-xs font-black rounded-xl transition-colors shadow-sm active:scale-95 cursor-pointer">
                    مشاهده فاکتور و پرداخت
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Render Component-Based Modular User Action Trigger Menu */}
          <UserMenu user={user} onLogout={handleLogout} />
        </div>

      </div>

      {/* Mobile Popover Overlay Full Width Search Interface */}
      {isSearchBarOpen && (
        <div className="absolute inset-x-0 top-0 bg-white p-4 shadow-md border-b border-purple-100 flex items-center gap-3 z-50 animate-in slide-in-from-top duration-200" ref={mobileSearchRef}>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="چی میخوای؟ سرچ کن..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pr-10 pl-4 bg-gray-50 border border-gray-200 focus:border-[#6320ee] rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
              autoFocus
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
          <button onClick={() => { setIsSearchBarOpen(false); setSearchQuery(''); }} className="p-2 text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer">بستن</button>

          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl overflow-hidden flex flex-col z-50 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-xs font-bold text-gray-400">در حال جستجو...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => { setIsSearchBarOpen(false); setSearchQuery(''); }}
                    className="p-3 border-b border-gray-50 hover:bg-purple-50 transition-colors flex flex-col gap-0.5 text-right"
                  >
                    <span className="text-xs font-black text-gray-900">{product.title}</span>
                    <span className="text-[10px] font-black text-[#6d28d9] mt-1">{product.price.toLocaleString('en-US')} تومان</span>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-bold text-gray-400">نتیجه‌ای یافت نشد.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Render Component-Based Isolated Mobile Drawer Portal */}
      <MobileDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        user={user} 
        isActive={isActive} 
      />
    </header>
  );
}