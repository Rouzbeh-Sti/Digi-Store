import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // یکی کردن استیت لودینگ دکمه
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchProductAndUserStatus = async () => {
      try {
        // دریافت اطلاعات محصول
        const prodRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (prodRes.ok) setProduct(await prodRes.json());

        // بررسی وضعیت اشتراک در صورت لاگین بودن
        const token = localStorage.getItem('token');
        if (token) {
          const subRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            // رفع باگ: حذف پرانتز چون Boolean است
            setHasSubscription(subData.hasActiveSubscription);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndUserStatus();
    // رفع باگ: ریکوئست تکراری checkSubscriptionStatus حذف شد
  }, [id]);

  const handleClaimWithSubscription = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/claim-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      const data = await res.json();

      if (res.ok) {
        showToast("دوره با موفقیت به کتابخانه شما اضافه شد!", 'success');
        setTimeout(() => navigate('/buyer/dashboard'), 1500);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast("خطایی در ارتباط با سرور رخ داد.", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      type: 'PRODUCT',
      category: product.category
    });
    showToast('محصول به سبد خرید اضافه شد', 'success');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">محصول یافت نشد.</div>;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-3 rounded-xl shadow-2xl transition-all duration-500 ease-out flex items-center gap-3 text-xs font-black ${
        toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
        {toast.message}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
          
          {/* product details */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-3 py-1 rounded-full mb-3 inline-block">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{product.title}</h1>
              <p className="text-sm font-bold text-gray-500 mt-2">فروشنده: {product.seller?.fullName || 'کاربر سیستم'}</p>
            </div>
            
            <div className="prose prose-sm text-gray-600 leading-relaxed font-medium">
              {product.description || 'توضیحاتی برای این محصول درج نشده است.'}
            </div>
          </div>

          {/* get product*/}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="mb-6">
                <span className="text-xs font-bold text-gray-500 block mb-1">قیمت محصول</span>
                <div className="text-2xl font-black text-[#6d28d9]">
                  {product.price.toLocaleString('fa-IR')} <span className="text-sm text-gray-500 font-normal">تومان</span>
                </div>
              </div>

              {product.allowSubscription ? (
                hasSubscription ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center">
                      <span className="text-xs font-black text-green-700">✨ شما اشتراک دیجی‌کورس دارید</span>
                    </div>
                    <button 
                      onClick={handleClaimWithSubscription} // رفع باگ: اسم تابع درست شد
                      disabled={isProcessing}
                      className="w-full py-3.5 bg-[#6320ee] hover:bg-[#521ac4] text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isProcessing ? 'در حال فعال‌سازی...' : '📥 دریافت رایگان با اشتراک'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      🛒 افزودن به سبد خرید
                    </button>
                    <p className="text-[10px] text-center font-bold text-gray-500 mt-2">
                      💡 با تهیه اشتراک <span className="text-purple-600">دیجی‌کورس</span> این محصول را رایگان دریافت کنید!
                    </p>
                  </div>
                )
              ) : (
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  🛒 افزودن به سبد خرید
                </button>
              )}
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}