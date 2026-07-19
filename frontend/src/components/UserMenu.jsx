import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const menuRef = useRef(null);

  // Fetch subscription details if user is logged in
  useEffect(() => {
    if (!user) return;
    const fetchSubStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.hasActiveSubscription) {
            setSubscription(data.subscription);
          }
        }
      } catch (err) {
        console.error("Error fetching sub status", err);
      }
    };
    fetchSubStatus();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-xs md:text-sm font-black text-gray-600 hover:text-[#6d28d9] transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">ورود</Link>
        <Link to="/register" className="px-4 py-2.5 bg-gradient-to-r from-[#6320ee] to-[#7c3aed] text-white text-xs md:text-sm font-black rounded-xl hover:shadow-md transition-all active:scale-95">ثبت نام</Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 border border-purple-100 bg-gradient-to-r from-purple-50/40 to-indigo-50/40 p-1.5 md:p-2 md:pr-5 rounded-xl shadow-xs cursor-pointer hover:border-purple-200 transition-all active:scale-95"
      >
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-sm font-black text-gray-900 flex items-center gap-1.5">
            {user.fullName}
            {subscription && <span title="کاربر ویژه دیجی‌کورس" className="text-emerald-500">💎</span>}
          </span>
          <span className="text-xs font-bold text-purple-600 mt-0.5">
            {user.role === 'ADMIN' ? 'مدیر سیستم' : user.role === 'SELLER' ? 'فروشنده' : 'خریدار'}
          </span>
        </div>
        <div className="w-9 h-9 relative rounded-lg bg-gradient-to-br from-[#6320ee] to-[#863bff] text-white font-black text-sm flex justify-center items-center">
          {user.fullName ? user.fullName.charAt(0) : 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden text-right transform origin-top-left transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
          
          {subscription && (
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50/20 border-b border-green-100/50">
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-md mb-2 inline-block">اشتراک فعال دیجی‌کورس</span>
              <p className="text-xs font-bold text-gray-700 mb-1">{subscription.plan.title}</p>
              <p className="text-[10px] font-bold text-gray-500">معتبر تا: <span className="font-black text-gray-800">{new Date(subscription.endDate).toLocaleDateString('fa-IR')}</span></p>
            </div>
          )}

          <div className="p-1.5 flex flex-col gap-0.5">
            <Link to="/buyer/dashboard" onClick={() => setIsOpen(false)} className="w-full text-right px-4 py-3 text-xs font-black text-gray-800 hover:bg-purple-50 hover:text-[#6d28d9] rounded-xl transition-colors">📚 کتابخانه محصولات من</Link>
            {user.role === 'ADMIN' && <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="w-full text-right px-4 py-3 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#6d28d9] rounded-xl transition-colors">🛠️ پنل مدیریت سیستم</Link>}
            {user.role === 'SELLER' && <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="w-full text-right px-4 py-3 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#6d28d9] rounded-xl transition-colors">📈 داشبورد فروشندگان</Link>}
            <Link to="/settings" onClick={() => setIsOpen(false)} className="w-full text-right px-4 py-3 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-[#6d28d9] rounded-xl transition-colors">⚙️ تنظیمات حساب</Link>
            <div className="border-t border-gray-50 my-1" />
            <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-right px-4 py-3 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">✕ خروج از حساب</button>
          </div>
        </div>
      )}
    </div>
  );
}