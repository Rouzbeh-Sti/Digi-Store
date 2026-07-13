import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EditProductModal from '../components/seller/EditProductModal';
import CreateProductModal from '../components/seller/CreateProductModal';

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('products'); 
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/seller/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const resData = await response.json();
        setData(resData);
      }
    } catch (error) {
      console.error("Error fetching seller analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProduct = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsCreateOpen(false);
        setMessage('محصول جدید با موفقیت ثبت شد و در صف تایید مدیر قرار گرفت.');
        setTimeout(() => setMessage(''), 4000);
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Product creation failure:", error);
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/seller/product-edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setEditingProduct(null);
        setMessage('تغییرات با موفقیت ذخیره شد و محصول برای تایید مجدد به ادمین ارجاع داده شد.');
        setTimeout(() => setMessage(''), 4000);
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Product update failure:", error);
    }
  };

  if (isLoading) return <div className="text-center py-24 text-sm font-bold text-gray-400">در حال دریافت داده‌های تحلیل فروشگاه...</div>;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">🚀 پنل عملکرد فروشندگان</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">پایش آنلاین درآمد، مدیریت دوره‌ها، تعامل با خریداران و بازخوردها</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#6320ee] hover:bg-[#5116c7] text-white font-black rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-purple-100 active:scale-95"
          >
            ➕ ثبت محصول / دوره جدید
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-black rounded-xl">
            ✓ {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-xs font-bold text-gray-400">💰 درآمد ناخالص فروشگاه</p>
            <p className="text-2xl font-black text-purple-600 mt-2">{data?.totalEarnings.toLocaleString('en-US')} تومان</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-xs font-bold text-gray-400">📦 کل کالاها و دوره‌های فروخته شده</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{data?.totalSales} تراکنش موفق</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-xs font-bold text-gray-400">📚 محصولات عرضه شده</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{data?.productsCount} آیتم فعال</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs mb-8">
          <h3 className="text-xs font-black text-gray-400 mb-6">📈 نمودار رشد تحلیل ماهیانه درآمد</h3>
          <div className="flex items-end justify-between h-36 pt-4 px-4 border-b border-gray-100">
            {data?.monthlyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center w-1/4 group relative">
                <div 
                  className="bg-gradient-to-t from-[#6320ee] to-[#863bff] w-10 rounded-t-xl transition-all duration-300 group-hover:brightness-95 shadow-sm" 
                  style={{ height: `${Math.max((d.earnings / (data.totalEarnings || 1)) * 120, 20)}px` }}
                />
                <span className="text-[10px] font-black text-gray-500 mt-3">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setActiveSubTab('products')} className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 cursor-pointer transition-all ${activeSubTab === 'products' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>📦 مدیریت محصولات و دوره‌ها</button>
          <button onClick={() => setActiveSubTab('customers')} className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 cursor-pointer transition-all ${activeSubTab === 'customers' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>👥 لیست خریداران ({data?.customers.length})</button>
          <button onClick={() => setActiveSubTab('reviews')} className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 cursor-pointer transition-all ${activeSubTab === 'reviews' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>💬 نظرات و بازخوردها ({data?.recentReviews.length})</button>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-xs min-h-[250px]">
          {activeSubTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-xs font-black text-gray-400">نام محصول / دوره</th>
                    <th className="p-4 text-xs font-black text-gray-400">نوع کالا</th>
                    <th className="p-4 text-xs font-black text-gray-400">قیمت پایه</th>
                    <th className="p-4 text-xs font-black text-gray-400">وضعیت تایید</th>
                    <th className="p-4 text-xs font-black text-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.products.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                      <td className="p-4 text-xs font-black text-gray-900">{p.title}</td>
                      <td className="p-4 text-xs font-bold text-gray-500">
                        {p.category === 'Course' ? '📚 دوره آموزشی' : p.category === 'Book' ? '📄 کتاب / PDF' : '🔑 لایسنس'}
                      </td>
                      <td className="p-4 text-xs font-bold text-gray-600">{p.price.toLocaleString('en-US')} تومان</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${p.status === 'APPROVED' ? 'bg-green-50 text-green-600' : p.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.status === 'APPROVED' ? 'تایید شده' : p.status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => setEditingProduct(p)} className="px-3 py-1.5 bg-purple-50 text-[#6320ee] border border-purple-100 text-xs font-black rounded-xl hover:bg-purple-100 transition-colors cursor-pointer active:scale-95">✏️ ویرایش محتوا</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSubTab === 'customers' && (
            <div className="overflow-x-auto">
              {data?.customers.length > 0 ? (
                <table className="w-full text-right border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="p-4 text-xs font-black text-gray-400">نام کامل دانشجو</th>
                      <th className="p-4 text-xs font-black text-gray-400">آدرس ایمیل</th>
                      <th className="p-4 text-xs font-black text-gray-400">محصول خریداری شده</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.customers.map((c, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                        <td className="p-4 text-xs font-black text-gray-900">{c.fullName}</td>
                        <td className="p-4 text-xs font-bold text-gray-500">{c.email}</td>
                        <td className="p-4 text-xs font-bold text-purple-600">{c.productTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center py-10 text-xs text-gray-400 font-bold">هنوز تراکنش موفقی برای محصولات شما ثبت نشده است.</p>}
            </div>
          )}

          {activeSubTab === 'reviews' && (
            <div className="space-y-4">
              {data?.recentReviews.length > 0 ? data.recentReviews.map(r => (
                <div key={r.id} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 text-right animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-gray-900">{r.buyerName} <span className="text-[10px] text-gray-400 font-bold">برای محصول ({r.productTitle})</span></span>
                    <span className="text-xs text-amber-500 font-black">⭐ {r.rating} / ۵</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed mt-2">{r.comment || 'بدون متن توضیحات.'}</p>
                </div>
              )) : <p className="text-center py-10 text-xs text-gray-400 font-bold">هیچ بازخوردی برای محصولات شما ثبت نشده است.</p>}
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <EditProductModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} product={editingProduct} onSave={handleSaveProduct} />
      )}

      {isCreateOpen && (
        <CreateProductModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleCreateProduct} />
      )}
    </div>
  );
}