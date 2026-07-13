import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function InspectionModal({ isOpen, onClose, type, entity }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger CSS transition after mounting
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 200); // Wait for transition out
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !entity) return null;

  return createPortal(
    <>
      {/* Smooth Fade Transition Background Layer Overlay */}
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-[99998] transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Premium High-Fidelity Animated Inspection Sheet */}
      <div 
        className={`fixed inset-x-4 bottom-0 sm:inset-0 sm:m-auto max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col p-6 z-[99999] h-fit max-h-[90vh] overflow-y-auto text-right transition-all duration-300 ease-out ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`} 
        style={{ direction: 'rtl' }}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h3 className="text-base font-black text-gray-900">
            {type === 'user' ? '👤 بررسی مشخصات کامل کاربر' : '📦 بازرسی جزئیات کالا / دوره'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-black cursor-pointer transition-colors text-lg">✕</button>
        </div>

        {type === 'user' ? (
          <div className="space-y-3.5 text-xs font-bold text-gray-600">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
              <p>👥 <span className="text-gray-400 font-medium">نام و نام خانوادگی:</span> <span className="text-gray-900 font-black">{entity.fullName}</span></p>
              <p>📧 <span className="text-gray-400 font-medium">پست الکترونیکی:</span> <span className="text-gray-900">{entity.email}</span></p>
              <p>🛡️ <span className="text-gray-400 font-medium">نقش کاربری:</span> <span className="text-purple-600 font-black">{entity.role}</span></p>
              {entity.storeName && (
                <p>🏢 <span className="text-gray-400 font-medium">نام تجاری فروشگاه:</span> <span className="text-gray-900">{entity.storeName}</span></p>
              )}
              <p>🚦 <span className="text-gray-400 font-medium">وضعیت حساب:</span> 
                <span className={`mr-2 px-2 py-0.5 rounded text-[10px] font-black ${entity.isBanned ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  {entity.isBanned ? '🚫 مسدود شده' : '✅ فعال'}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs font-bold text-gray-600">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
              <p>📦 <span className="text-gray-400 font-medium">عنوان محصول:</span> <span className="text-gray-900 font-black">{entity.title}</span></p>
              <p>🏷️ <span className="text-gray-400 font-medium">دسته‌بندی:</span> <span className="text-gray-900">{entity.category}</span></p>
              <p>💰 <span className="text-gray-400 font-medium">قیمت پایه:</span> <span className="text-purple-600 font-black">{entity.price.toLocaleString('en-US')} تومان</span></p>
              {entity.fileUrl && (
                <p className="break-all">🔗 <span className="text-gray-400 font-medium">لینک فایل / استریم:</span> <span className="text-blue-600 font-semibold">{entity.fileUrl}</span></p>
              )}
              <p>🚦 <span className="text-gray-400 font-medium">وضعیت بررسی:</span> <span className="text-gray-900 font-black">{entity.status}</span></p>
              <div className="border-t border-gray-100 pt-2.5 mt-1">
                <p className="text-gray-400 font-medium">توضیحات معرفی کالا:</p>
                <p className="text-gray-700 font-medium mt-1 leading-relaxed">{entity.description || 'توضیحاتی برای این کالا ثبت نشده است.'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-gray-100 text-left">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl transition-colors cursor-pointer">
            بستن پنجره
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}