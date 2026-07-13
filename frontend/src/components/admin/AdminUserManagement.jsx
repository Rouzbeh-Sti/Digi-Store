import React, { useState, useRef, useEffect } from 'react';
import SharedCustomTable from '../SharedCustomTable';

export default function AdminUserManagement({ users, onToggleBan, onRoleChange, onInspect }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headers = ["نام کاربر", "ایمیل", "سطح دسترسی (نقش)", "وضعیت حساب", "عملیات اداری"];

  const sortableFields = {
    0: 'fullName',
    1: 'email',
    2: 'role'
  };

  const renderRowCells = (u) => [
    <span className="text-xs font-black text-gray-900">{u.fullName}</span>,
    <span className="text-xs font-bold text-gray-500">{u.email}</span>,
    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide ${
      u.role === 'ADMIN' ? 'bg-purple-100/70 text-purple-700 border border-purple-200/40' :
      u.role === 'SELLER' ? 'bg-blue-100/70 text-blue-700 border border-blue-200/40' : 'bg-gray-100 text-gray-700 border border-gray-200/50'
    }`}>
      {u.role === 'ADMIN' ? '👑 مدیر ارشد' : u.role === 'SELLER' ? '💼 فروشنده مستقل' : '👤 خریدار پلتفرم'}
    </span>,
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${u.isBanned ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
      {u.isBanned ? '🚫 مسدود شده' : '✅ فعال'}
    </span>,
    <div className="relative text-center action-gate">
      <button 
        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === u.id ? null : u.id); }}
        className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-[#6320ee] border border-purple-100/60 rounded-xl text-[11px] font-black shadow-xs hover:from-[#6320ee] hover:to-[#863bff] hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
      >
        ⚙️ عملیات
      </button>
      {activeMenu === u.id && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border border-purple-100/80 shadow-2xl rounded-2xl z-50 p-2 flex flex-col gap-1 text-right transform origin-top transition-all duration-200 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-2">
          <button onClick={() => { setActiveMenu(null); onInspect(u); }} className="w-full text-right p-2.5 text-[11px] font-black hover:bg-purple-50 text-purple-700 rounded-xl transition-all cursor-pointer">🔍 بازرسی شناسنامه کاربر</button>
          <button onClick={() => { setActiveMenu(null); onToggleBan(u.id, !u.isBanned); }} className={`w-full text-right p-2.5 text-[11px] font-black rounded-xl transition-all cursor-pointer ${u.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}>{u.isBanned ? '🔓 فعال‌سازی مجدد حساب' : '🚫 مسدودسازی و اخراج'}</button>
          <div className="border-t border-purple-50 my-1" />
          <span className="text-[9px] px-2 font-black text-purple-400 block mb-1">تغییر سطح نقش:</span>
          <div className="grid grid-cols-3 gap-1 px-1">
            <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'BUYER'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer">Buyer</button>
            <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'SELLER'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer">Seller</button>
            <button onClick={() => { setActiveMenu(null); onRoleChange(u.id, 'ADMIN'); }} className="text-[9px] font-black p-1.5 bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-[#6d28d9] rounded-lg cursor-pointer">Admin</button>
          </div>
        </div>
      )}
    </div>
  ];

  return <div ref={menuRef}><SharedCustomTable headers={headers} rows={users} renderRowCells={renderRowCells} sortableFields={sortableFields} /></div>;
}