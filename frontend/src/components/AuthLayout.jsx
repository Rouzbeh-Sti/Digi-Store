import React from 'react';

// AuthLayout components structure using professional Tailwind utility classes
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Left Column: Dynamic Form Area */}
      <div className="flex-1 flex justify-center items-center bg-white px-6">
        {children}
      </div>

      {/* Right Column: Purple Branding Panel */}
      <div className="flex-1 bg-[#6320ee] hidden md:flex flex-col justify-center items-center color-white text-white p-10">
        <div className="max-w-md w-full text-center">
          
          {/* Brand Logo Container */}
          <div className="bg-white/20 w-16 height-16 h-16 rounded-xl flex justify-center items-center mx-auto mb-5 text-2xl">
            ⚡
          </div>
          
          <h1 className="text-4xl font-bold mb-3">DigiStore</h1>
          <p className="text-white/80 mb-10 text-sm">مدیریت هوشمند لایسنس‌های نرم‌افزاری برای افراد و تیم‌ها</p>
          
          {/* Features List (RTL for Persian support) */}
          <ul className="space-y-4 text-right" style={{ direction: 'rtl' }}>
            <li className="text-sm">• دریافت لایسنس فوری پس از پرداخت</li>
            <li className="text-sm">• مدیریت متمرکز همه اشتراک‌ها</li>
            <li className="text-sm">• تمدید خودکار قبل از انقضا</li>
            <li className="text-sm">• پشتیبانی ۲۴ ساعته فارسی</li>
          </ul>
          
        </div>
      </div>

    </div>
  );
}