import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/50 px-6 py-4 shadow-xs">
      {/* Container to center and align navigation items */}
      <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
        
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#863bff] tracking-tight hover:opacity-90 transition-opacity">DigiStore</Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link to="/" className="text-[#6d28d9] border-b-2 border-[#6d28d9] pb-1">خانه</Link>
            <Link to="/marketplace" className="hover:text-[#6d28d9] transition-colors">بازارچه محصولات</Link>
            <Link to="/pricing" className="hover:text-[#6d28d9] transition-colors">پلن‌های اشتراک</Link>
          </nav>
        </div>

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
                className="mr-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-sm"
                title="خروج از حساب"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-black text-gray-600 hover:text-[#6d28d9] transition-colors px-2 py-1">ورود</Link>
              <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-[#6320ee] to-[#7c3aed] hover:shadow-lg hover:shadow-purple-100 text-white text-sm font-black rounded-xl transition-all">ثبت‌نام رایگان</Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}