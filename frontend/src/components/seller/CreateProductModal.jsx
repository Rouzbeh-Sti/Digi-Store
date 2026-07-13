import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function CreateProductModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Course'); 
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await onSave({
      title,
      price: parseFloat(price),
      category,
      fileUrl: category === 'License' ? '' : fileUrl,
      description
    });

    setTitle('');
    setPrice('');
    setCategory('Course');
    setFileUrl('');
    setDescription('');
    setIsSubmitting(false);
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
          <h3 className="text-base font-black text-gray-900">➕ ثبت و انتشار کالا یا دوره جدید</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-bold cursor-pointer" disabled={isSubmitting}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">عنوان یا نام محصول</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: آموزش پیشرفته ری‌اکت یا لایسنس ویندوز ۱۱" className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee]" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">نوع محصول دیجیتال</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-xs font-black bg-white focus:outline-none focus:border-[#6320ee] cursor-pointer">
              <option value="Course">📚 دوره آموزشی (پخش آنلاین ویدیو)</option>
              <option value="Book">📄 کتاب دیجیتال / فایل چاپی (PDF / ZIP)</option>
              <option value="License">🔑 لایسنس اختصاصی نرم‌افزار / کد فعال‌سازی</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">قیمت پایه (تومان)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="مثال: ۱۵۰۰۰۰" className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee]" required />
          </div>

          {category !== 'License' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {category === 'Course' ? '🔗 لینک استریم ویدیوها' : '🔗 آدرس امن دانلود فایل'}
              </label>
              <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://storage.digistore.com/..." className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee]" required />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">توضیحات تکمیلی کالا</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="سرفصل‌ها یا مشخصات فنی فایل را وارد کنید..." className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold h-24 resize-none focus:outline-none focus:border-[#6320ee]" />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#6320ee] text-white text-xs font-black rounded-xl hover:bg-[#4d14c2] transition-colors cursor-pointer disabled:opacity-50">
              {isSubmitting ? 'در حال ارسال درخواست...' : 'ارسال کالا جهت بررسی و تایید مدیر'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer" disabled={isSubmitting}>انصراف</button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}