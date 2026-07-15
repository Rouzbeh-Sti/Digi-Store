import React from 'react';
import SharedCustomTable from '../SharedCustomTable';

export default function SellerProducts({ products, onEdit }) {
  const headers = ["نام محصول / دوره", "نوع کالا", "قیمت پایه", "وضعیت تایید", "عملیات"];

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
      {p.status === 'APPROVED' ? 'تایید شده' : p.status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}
    </span>,
    <div className="text-center">
      <button 
        onClick={() => onEdit(p)} 
        className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-[#6320ee] hover:from-[#6320ee] hover:to-[#863bff] hover:text-white border border-purple-100/60 rounded-xl text-xs font-black shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
      >
        ✏️ ویرایش محتوا
      </button>
    </div>
  ];

  return <SharedCustomTable headers={headers} rows={products} renderRowCells={renderRowCells} sortableFields={sortableFields} />;
}