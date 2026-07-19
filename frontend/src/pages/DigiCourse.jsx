import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';

export default function DigiCourse() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/plans`);
        if (res.ok) {
          const data = await res.json();
          setPlans(data.filter(plan => plan.isActive));
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleAddPlanToCart = (plan) => {
    addToCart({
      id: plan.id,
      title: `اشتراک دیجی‌کورس - ${plan.title}`,
      price: plan.price,
      type: 'SUBSCRIPTION',
      category: 'اشتراک VIP'
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a] flex flex-col" style={{ direction: 'rtl' }}>
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full mb-4">
            دسترسی نامحدود
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            اشتراک ویژه <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">دیجی‌کورس</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm max-w-xl mx-auto leading-relaxed">
            با تهیه این اشتراک، نیازی به خرید تکی دوره‌ها ندارید. به صدها ساعت آموزش پریمیوم، تخصصی و پروژه‌محور با یک کلیک دسترسی پیدا کنید.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-3xl p-8 border ${idx === 1 ? 'border-emerald-500 shadow-xl shadow-emerald-100/50 scale-105' : 'border-gray-200 shadow-sm'} flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-500`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {idx === 1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-4 py-1 rounded-b-xl">
                    پیشنهاد ویژه
                  </div>
                )}
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                
                <h2 className="text-xl font-black text-gray-900 mb-2 z-10 mt-2">{plan.title}</h2>
                <p className="text-xs font-bold text-gray-500 mb-8 z-10 h-10">{plan.description}</p>
                
                <div className="text-3xl font-black text-emerald-600 mb-8 z-10">
                  {plan.price.toLocaleString('fa-IR')} <span className="text-sm text-gray-400">تومان</span>
                </div>

                <ul className="space-y-4 mb-8 text-xs font-bold text-gray-600 z-10">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 flex justify-center items-center rounded-full text-[10px]">✓</span> 
                    دسترسی کامل به دوره‌های دارای نشان
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 flex justify-center items-center rounded-full text-[10px]">✓</span> 
                    اعتبار {plan.duration === 'MONTHLY' ? '۳۰ روزه' : plan.duration === 'YEARLY' ? '۳۶۵ روزه' : '۹۰ روزه'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 flex justify-center items-center rounded-full text-[10px]">✓</span> 
                    پشتیبانی اختصاصی و دریافت آپدیت‌ها
                  </li>
                </ul>

                <button 
                  onClick={() => handleAddPlanToCart(plan)}
                  className={`mt-auto w-full py-4 text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer z-10 ${idx === 1 ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-900 hover:bg-black text-white'}`}
                >
                  افزودن به سبد خرید
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}