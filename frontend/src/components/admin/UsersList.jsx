import React, { useState, useRef, useEffect } from 'react';

export default function UsersList({ users, onToggleBan, onRoleChange, onInspect }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto" ref={tableRef}>
      <table className="w-full text-right border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100/80">
            <th className="p-4 text-xs font-black text-gray-400">نام کاربر</th>
            <th className="p-4 text-xs font-black text-gray-400">ایمیل</th>
            <th className="p-4 text-xs font-black text-gray-400">سطح دسترسی (نقش)</th>
            <th className="p-4 text-xs font-black text-gray-400">وضعیت حساب</th>
            <th className="p-4 text-xs font-black text-gray-400 text-center">عملیات اداری</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr 
              key={u.id} 
              style={{ animationDelay: `${index * 40}ms` }}
              className="border-b border-gray-50 hover:bg-purple-50/20 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              onClick={(e) => {
                if (!e.target.closest('.action-btn-container')) {
                  setActiveMenu(null);
                }
              }}
            >
              <td className="p-4 text-xs font-black text-gray-900">{u.fullName}</td>
              <td className="p-4 text-xs font-bold text-gray-500">{u.email}</td>
              <td className="p-4">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide ${
                  u.role === 'ADMIN' ? 'bg-purple-100/70 text-purple-700 border border-purple-200/40' :
                  u.role === 'SELLER' ? 'bg-blue-100/70 text-blue-700 border border-blue-200/40' : 
                  'bg-gray-100 text-gray-700 border border-gray-200/50'
                }`}>
                  {u.role === 'ADMIN' ? '👑 مدیر ارشد' : u.role === 'SELLER' ? '💼 فروشنده کالا' : '👤 خریدار پلتفرم'}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                  u.isBanned ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {u.isBanned ? '🚫 مسدود شده' : '✅ فعال'}
                </span>
              </td>
              <td className="p-4 relative text-center action-btn-container">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === u.id ? null : u.id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-[#6320ee] hover:from-[#6320ee] hover:to-[#863bff] hover:text-white border border-purple-100/60 rounded-xl text-[11px] font-black shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  ⚙️ عملیات
                </button>

                {activeMenu === u.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border border-purple-100/80 shadow-2xl rounded-2xl z-50 p-2 flex flex-col gap-1 text-right transform origin-top transition-all duration-200 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-2">
                    <button 
                      onClick={() => { setActiveMenu(null); onInspect(u); }} 
                      className="w-full text-right p-2.5 text-[11px] font-black hover:bg-purple-50 text-purple-700 rounded-xl transition-all cursor-pointer"
                    >
                      🔍 بازرسی شناسنامه کاربر
                    </button>
                    <button 
                      onClick={() => { setActiveMenu(null); onToggleBan(u.id, !u.isBanned); }} 
                      className={`w-full text-right p-2.5 text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                        u.isBanned ? 'hover:bg-green-50 text-green-600' : 'hover:bg-red-50 text-red-600'
                      }`}
                    >
                      {u.isBanned ? '🔓 فعال‌سازی مجدد حساب' : '🚫 مسدودسازی و اخراج'}
                    </button>
                    <div className="border-t border-purple-50 my-1" />
                    <span className="text-[9px] px-2 font-black text-purple-400 block mb-1">ارتقا یا تغییر سطح نقش:</span>
                    <div className="grid grid-cols-3 gap-1 px-1">
                      <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'BUYER'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer transition-colors">Buyer</button>
                      <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'SELLER'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer transition-colors">Seller</button>
                      <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'ADMIN'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer transition-colors">Admin</button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}