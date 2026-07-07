import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f8fc]" style={{ direction: 'rtl' }}>
      
      {/* Right Column: Dynamic Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 relative">
        
        {/* Minimal Return Cross Button - Positioned on the top-right corner */}
        <Link 
          to="/" 
          className="absolute top-6 right-6 flex justify-center items-center w-10 h-10 text-gray-400 hover:text-[#6d28d9] bg-[#f8f8fc] hover:bg-purple-50 rounded-xl transition-all border border-gray-100 z-50"
          title="Return Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {children}
      </div>

      {/* Left Column: Premium Purple Branding Panel */}
      <div className="flex-1 bg-gradient-to-tr from-[#4b14b8] via-[#6320ee] to-[#863bff] hidden md:flex flex-col justify-center items-center text-white p-10 relative overflow-hidden">
        
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full text-center relative z-10">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex justify-center items-center mx-auto mb-6 text-2xl shadow-inner animate-pulse">
            ⚡
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">DigiStore</h1>
          <p className="text-purple-100 mb-12 text-sm font-medium">بازارچه هوشمند خرید و فروش دارایی‌ها و لایسنس‌های دیجیتال</p>
          <ul className="space-y-4 text-right max-w-xs mx-auto border-r-2 border-white/20 pr-4">
            <li className="text-sm font-bold text-white/90">• دریافت فوری کلید دسترسی و لینک فایل</li>
            <li className="text-sm font-bold text-white/90">• ضمانت اصالت محصولات و اشتراک اپ‌ها</li>
            <li className="text-sm font-bold text-white/90">• تمدید خودکار حساب‌ها قبل از انقضا</li>
            <li className="text-sm font-bold text-white/90">• سیستم یکپارچه چند فروشندگی ایمن</li>
          </ul>
        </div>
      </div>

    </div>
  );
}