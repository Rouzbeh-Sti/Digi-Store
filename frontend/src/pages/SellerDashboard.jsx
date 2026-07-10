import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the products created by the current seller on load
  useEffect(() => {
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

    fetchSellerProducts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">پنل فروشندگان</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">مدیریت محصولات و دارایی های دیجیتال شما</p>
          </div>
          <button className="px-6 py-3 bg-[#6320ee] text-white font-black rounded-xl text-sm hover:bg-[#5116c7] transition-all cursor-pointer">
            + ثبت محصول جدید
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-bold text-sm">در حال بارگذاری لیست محصولات...</div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-xs font-black text-gray-400">شناسه</th>
                    <th className="p-4 text-xs font-black text-gray-400">نام محصول</th>
                    <th className="p-4 text-xs font-black text-gray-400">قیمت (تومان)</th>
                    <th className="p-4 text-xs font-black text-gray-400">دسته بندی</th>
                    <th className="p-4 text-xs font-black text-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-xs font-bold text-gray-900">#{product.id}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.title}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.price.toLocaleString('en-US')}</td>
                      <td className="p-4 text-xs font-bold text-gray-900">{product.category || 'عمومی'}</td>
                      <td className="p-4">
                        <button className="text-xs font-bold text-blue-500 hover:text-blue-700 ml-4 cursor-pointer">ویرایش</button>
                        <button className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-bold text-sm">شما هنوز هیچ محصولی ثبت نکرده اید.</div>
          )}
        </div>
      </div>
    </div>
  );
}