import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditProductModal({ isOpen, onClose, product, onSave }) {
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price || '');
  const [category, setCategory] = useState(product?.category || 'Course');
  const [description, setDescription] = useState(product?.description || '');
  const [allowSubscription, setAllowSubscription] = useState(product?.allowSubscription ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({ 
      productId: product.id, 
      title, 
      price: parseFloat(price), 
      category, 
      description,
      allowSubscription: category === 'Course' ? allowSubscription : false
    });
  };

  return createPortal(
    <>
      <div 
        onClick={() => !isSubmitting && onClose()} 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[99998] animate-in fade-in duration-200" 
      />
      <div 
        className="fixed inset-x-4 bottom-0 sm:inset-0 sm:m-auto max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col p-6 z-[99999] h-fit max-h-[90vh] overflow-y-auto text-right animate-in fade-in zoom-in-95 duration-200" 
        style={{ direction: 'rtl' }}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h3 className="text-base font-black text-gray-900">✏️ ویرایش مشخصات محصول</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-bold cursor-pointer" disabled={isSubmitting}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">عنوان محصول</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee]" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">قیمت (تومان)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee]" required />
          </div>

          {/* Conditional Subscription Toggle (Only for Courses) */}
          {category === 'Course' && (
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
              <div className="text-right">
                <span className="block text-xs font-black text-gray-900">امکان دسترسی با خرید اشتراک</span>
                <span className="text-[10px] text-gray-400 font-bold mt-1 block">دانشجویان دارای اشتراک فعال دیجی‌کورس به این دوره دسترسی داشته باشند؟</span>
              </div>
              <input 
                type="checkbox" 
                checked={allowSubscription} 
                onChange={(e) => setAllowSubscription(e.target.checked)}
                className="w-5 h-5 accent-[#6320ee] cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">توضیحات تکمیلی</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold h-24 resize-none focus:outline-none focus:border-[#6320ee]" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#6320ee] text-white text-xs font-black rounded-xl hover:bg-[#4d14c2] transition-colors cursor-pointer disabled:opacity-50">
              {isSubmitting ? 'در حال ذخیره‌سازی...' : 'اعمال تغییرات و بررسی مجدد'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer" disabled={isSubmitting}>انصراف</button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}