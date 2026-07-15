import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Filter only completed orders to show active products
          setOrders(data.filter(o => o.status === 'COMPLETED'));
        }
      } catch (error) {
        console.error('Network error fetching library:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">📚 کتابخانه محصولات من</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">دسترسی دائمی به فایل‌ها، دوره‌ها و کدهای فعال‌سازی خریداری شده</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <div className="text-6xl mb-4 opacity-50">📂</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">کتابخانه شما خالی است</h2>
            <p className="text-xs font-bold text-gray-400 mb-6">به بازارچه سر بزنید و اولین محصول خود را تهیه کنید.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-xs font-black text-gray-500">شناسه خرید: #{order.id}</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col p-5 bg-gradient-to-br from-purple-50/50 to-white rounded-2xl border border-purple-100/50 gap-4 shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Product Info */}
                      <div>
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-[9px] font-black rounded mb-2">
                          {item.product.category === 'Course' ? 'دوره' : item.product.category === 'License' ? 'لایسنس' : 'فایل'}
                        </span>
                        <h3 className="text-sm font-black text-gray-900 line-clamp-1">{item.product.title}</h3>
                      </div>
                      
                      {/* License Key Box */}
                      {item.license && (
                        <div className="bg-white p-3 rounded-xl border border-gray-200 border-dashed flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400">کد اختصاصی:</span>
                          <span className="text-xs font-black text-gray-900 font-mono tracking-wider">
                            {item.license.licenseKey}
                          </span>
                        </div>
                      )}

                      {/* Action Button */}
                      {item.product.category !== 'License' && item.product.fileUrl ? (
                        <a 
                          href={item.product.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-auto w-full py-2.5 bg-[#6320ee] hover:bg-[#521ac4] text-white text-center text-xs font-black rounded-xl transition-colors"
                        >
                          🔗 دریافت فایل / مشاهده
                        </a>
                      ) : (
                        <div className="mt-auto w-full py-2.5 bg-green-50 text-green-700 text-center text-xs font-black rounded-xl border border-green-100">
                          ✅ لایسنس آماده استفاده
                        </div>
                      )}
                      
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}