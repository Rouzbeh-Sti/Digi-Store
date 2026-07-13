import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Course');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const fetchSellerProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/seller`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else if (response.status === 401 || response.status === 403) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [navigate]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!title || !price) {
      setFormError('وارد کردن عنوان و قیمت الزامی است.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('Course');
        fetchSellerProducts();
      } else {
        setFormError(data.message || 'خطا در ثبت محصول.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormError('خطا در اتصال به سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">پنل فروشندگان</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">مدیریت محصولات و دارایی‌های دیجیتال شما</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#6320ee] hover:bg-[#5116c7] text-white font-black rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-purple-100"
          >
            + ثبت محصول جدید
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-bold text-sm">در حال بارگذاری لیست محصولات...</div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-xs font-black text-gray-400">شناسه</th>
                    <th className="p-4 text-xs font-black text-gray-400">نام محصول</th>
                    <th className="p-4 text-xs font-black text-gray-400">قیمت (تومان)</th>
                    <th className="p-4 text-xs font-black text-gray-400">دسته‌بندی</th>
                    <th className="p-4 text-xs font-black text-gray-400">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-xs font-bold text-gray-900">#{product.id}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.title}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.price.toLocaleString('en-US')}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.category}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black ${
                          product.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' :
                          product.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {product.status === 'APPROVED' ? 'تایید شده' : product.status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-bold text-sm">شما هنوز هیچ محصولی ثبت نکرده‌اید.</div>
          )}
        </div>
      </div>

      {/* Portaled Product Creation Modal Form */}
      {isModalOpen && createPortal(
        <>
          <div 
            onClick={() => !isSubmitting && setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 opacity-100"
            style={{ zIndex: 99998 }}
          />

          <div 
            className="fixed inset-x-4 bottom-0 sm:inset-0 sm:m-auto max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:h-fit transition-all duration-300 text-right opacity-100"
            style={{ zIndex: 99999 }}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sm:rounded-t-2xl">
              <span className="text-base font-black text-gray-900">ثبت محصول دیجیتال جدید</span>
              <button 
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
                  ⚠ {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">عنوان محصول</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: آموزش کامل جاوااسکریپت ۲۰۲۶"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">دسته‌بندی</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-bold cursor-pointer"
                >
                  <option value="Course">دوره آموزشی</option>
                  <option value="Book">کتاب / جزوه</option>
                  <option value="License">لایسنس نرم‌افزار</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">قیمت (تومان)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثال: ۱۵۰۰۰۰"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">توضیحات محصول</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات جامع درباره سرفصل‌ها یا مشخصات فنی فایل..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold h-24 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-50 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#6320ee] hover:bg-[#5116c7] text-white font-black rounded-xl transition-all text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ارسال جهت بررسی و تایید'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all text-xs cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}