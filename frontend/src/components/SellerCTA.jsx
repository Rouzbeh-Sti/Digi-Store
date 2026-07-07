import React from 'react';
import { Link } from 'react-router-dom';

export default function SellerCTA() {
  return (
    <section className="max-w-4xl mx-auto px-6 mb-20">
      <div className="bg-[#6d28d9] rounded-3xl p-10 text-white text-center relative overflow-hidden shadow-xl shadow-purple-100">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
        <h2 className="text-2xl font-black mb-3">شروع کسب درآمد در دیجی‌استور</h2>
        <p className="text-white/80 max-w-md mx-auto text-sm leading-relaxed mb-6">
          مدرس هستید یا لایسنس نرم‌افزار، اکانت و کتاب دیجیتال می‌فروشید؟ پنل فروشندگان خود را فعال کنید و محصولاتتان را عرضه کنید.
        </p>
        <Link to="/register?role=SELLER" className="inline-block px-6 py-3 bg-white text-[#6d28d9] font-black rounded-xl text-sm hover:bg-purple-50 transition-colors">ثبت‌نام به عنوان فروشنده / مدرس</Link>
      </div>
    </section>
  );
}