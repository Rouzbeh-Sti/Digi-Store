import React, { useState, useRef, useEffect } from 'react';
import SharedCustomTable from '../SharedCustomTable';

export default function AdminProductManagement({ products, onVerify, onInspect }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headers = ["نام محصول / دوره", "نوع کالا", "قیمت پایه", "وضعیت بررسی", "اقدامات مدیریتی"];

  const sortableFields = {
    0: 'title',
    2: 'price',
    3: 'status'
  };

  // Accurately map product categories and provide a safe fallback for unknown types
  const renderRowCells = (p) => [
    <span className="text-xs font-black text-gray-900">{p.title}</span>,
    <span className="text-xs font-bold text-gray-500">
      {p.category === 'Course' ? '📚 دوره آموزشی' : 
       p.category === 'Book' ? '📄 کتاب / PDF' : 
       p.category === 'License' ? '🔑 لایسنس' : '📦 سایر موارد'}
    </span>,
    <span className="text-xs font-bold text-purple-600">{p.price.toLocaleString('en-US')} تومان</span>,
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
      p.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' :
      p.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
    }`}>
      {p.status === 'APPROVED' ? 'منتشر شده' : p.status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}
    </span>,
    <div className="relative text-center action-gate">
      <button 
        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p.id ? null : p.id); }}
        className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-[#6320ee] border border-purple-100/60 rounded-xl text-[11px] font-black shadow-xs hover:from-[#6320ee] hover:to-[#863bff] hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
      >
        ⚙️ عملیات
      </button>
      {activeMenu === p.id && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-44 bg-white border border-purple-100/80 shadow-2xl rounded-2xl z-50 p-1.5 flex flex-col gap-0.5 text-right transform origin-top transition-all duration-200 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-2">
          <button onClick={() => { setActiveMenu(null); onInspect(p); }} className="w-full text-right p-2.5 text-[11px] font-black hover:bg-purple-50 text-purple-700 rounded-xl transition-all cursor-pointer">🔍 بازرسی کامل محتوا</button>
          {p.status !== 'APPROVED' && <button onClick={() => { setActiveMenu(null); onVerify(p.id, 'APPROVED'); }} className="w-full text-right p-2.5 text-[11px] font-black hover:bg-green-50 text-green-600 rounded-xl transition-all cursor-pointer">✅ تایید و انتشار عمومی</button>}
          {p.status !== 'REJECTED' && <button onClick={() => { setActiveMenu(null); onVerify(p.id, 'REJECTED'); }} className="w-full text-right p-2.5 text-[11px] font-black hover:bg-red-50 text-red-600 rounded-xl transition-all cursor-pointer">🚫 لغو انتشار و رد کالا</button>}
        </div>
      )}
    </div>
  ];

  return <div ref={menuRef}><SharedCustomTable headers={headers} rows={products} renderRowCells={renderRowCells} sortableFields={sortableFields} /></div>;
}