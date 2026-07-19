import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("برای تکمیل خرید ابتدا باید وارد حساب کاربری شوید.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // ارسال نوع آیتم به همراه آیدی برای تفکیک محصول از اشتراک در بک‌اند
      const items = cart.map(item => ({ id: item.id, type: item.type || 'PRODUCT' }));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items }) // تغییر از productIds به items
      });

      const data = await response.json();

      if (response.ok && data.paymentUrl) {
        clearCart(); // Clear cart as they transition to the gateway
        // Redirect browser to Zarinpal Sandbox
        window.location.href = data.paymentUrl; 
      } else {
        alert(`خطا: ${data.message}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Gateway Connection Error:", error);
      alert("ارتباط با سرور قطع شد.");
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">🛒 سبد خرید شما</h1>
        <p className="text-sm text-gray-500 font-medium mb-8">بررسی نهایی فاکتور و اتصال به درگاه پرداخت امن</p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">سبد خرید شما خالی است!</h2>
            <p className="text-xs font-bold text-gray-400 mb-6">هنوز هیچ محصولی برای خرید انتخاب نکرده‌اید.</p>
            <Link to="/marketplace" className="inline-block px-8 py-3.5 bg-[#6320ee] hover:bg-[#521ac4] text-white font-black rounded-xl text-xs transition-colors cursor-pointer">
              مشاهده بازارچه محصولات
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="flex-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs h-fit">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                <span className="text-sm font-black text-gray-900">لیست محصولات ({cart.length})</span>
                <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">✕ پاک کردن همه</button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                    <div className="flex flex-col">
                      <Link to={`/product/${item.id}`} className="text-sm font-black text-gray-900 hover:text-[#6320ee] transition-colors line-clamp-1">{item.title}</Link>
                      <span className="text-[11px] font-bold text-gray-400 mt-1">
                        دسته‌بندی: {item.category === 'Course' ? 'دوره' : item.category === 'License' ? 'لایسنس' : 'فایل/کتاب'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-black text-[#6d28d9]">{item.price.toLocaleString('en-US')} <span className="text-[10px] text-gray-400 font-bold">تومان</span></span>
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex justify-center items-center rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs h-fit sticky top-24">
              <h3 className="text-base font-black text-gray-900 mb-6">خلاصه صورت‌حساب</h3>
              
              <div className="space-y-4 text-sm font-bold text-gray-600 mb-6 pb-6 border-b border-gray-50">
                <div className="flex justify-between">
                  <span>تعداد اقلام:</span>
                  <span className="text-gray-900">{cart.length} عدد</span>
                </div>
                <div className="flex justify-between">
                  <span>تخفیف:</span>
                  <span className="text-red-500">۰ تومان</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-black text-gray-900">مبلغ قابل پرداخت:</span>
                <span className="text-lg font-black text-[#6d28d9]">{getCartTotal().toLocaleString('en-US')} <span className="text-xs text-gray-400 font-bold">تومان</span></span>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-[#6320ee] to-[#863bff] hover:from-[#521ac4] hover:to-[#6d28d9] text-white font-black rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'در حال انتقال به درگاه...' : '💳 اتصال به درگاه پرداخت'}
              </button>
              
              <p className="text-center text-[10px] font-bold text-gray-400 mt-4">
                پرداخت شما از طریق درگاه امن زرین‌پال انجام می‌شود.
              </p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}