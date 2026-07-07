import React from 'react';

export default function Hero({ searchQuery, setSearchQuery }) {
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

        <div className="max-w-md mx-auto relative shadow-xl shadow-purple-100/30 rounded-2xl">
          <input 
            type="text" 
            placeholder="جستجوی دوره، کتاب، لایسنس اپلیکیشن..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4.5 pr-12 rounded-2xl bg-white border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6320ee] transition-all text-xs font-bold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>

      </div>
    </section>
  );
}