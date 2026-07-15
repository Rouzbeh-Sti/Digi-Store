import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const config = {
    success: {
      icon: '✅',
      title: 'پرداخت با موفقیت انجام شد',
      desc: 'سفارش شما ثبت شد و لایسنس‌های اختصاصی صادر گردید.',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    failed: {
      icon: '❌',
      title: 'پرداخت ناموفق بود',
      desc: 'عملیات پرداخت لغو شد یا با خطا مواجه گردید. در صورت کسر وجه، مبلغ تا ۷۲ ساعت بازخواهد گشت.',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    invalid: {
      icon: '⚠️',
      title: 'تراکنش نامعتبر',
      desc: 'این تراکنش قبلاً پردازش شده یا شناسه آن نامعتبر است.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    error: {
      icon: '🔌',
      title: 'خطای سیستمی',
      desc: 'ارتباط با سرور بانک برقرار نشد. لطفا بعدا مجددا تلاش کنید.',
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200'
    }
  };

  const currentData = config[status] || config.error;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a] flex flex-col" style={{ direction: 'rtl' }}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-md w-full bg-white rounded-3xl p-8 border shadow-xl text-center flex flex-col items-center animate-in zoom-in-95 duration-500 ${currentData.border}`}>
          <div className={`w-24 h-24 flex items-center justify-center rounded-full text-5xl mb-6 ${currentData.bg}`}>
            {currentData.icon}
          </div>
          
          <h1 className={`text-2xl font-black mb-3 ${currentData.color}`}>
            {currentData.title}
          </h1>
          
          <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8">
            {currentData.desc}
          </p>

          <div className="w-full flex flex-col gap-3">
            {status === 'success' ? (
              <Link to="/buyer/dashboard" className="w-full py-4 bg-[#6320ee] hover:bg-[#521ac4] text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95">
                📦 ورود به کتابخانه و دانلود محصولات
              </Link>
            ) : (
              <Link to="/cart" className="w-full py-4 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95">
                🔄 بازگشت به سبد خرید و تلاش مجدد
              </Link>
            )}
            <Link to="/" className="w-full py-3 text-gray-500 hover:text-gray-800 text-xs font-bold transition-colors">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}