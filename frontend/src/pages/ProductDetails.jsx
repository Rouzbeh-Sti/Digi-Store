import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          navigate('/marketplace');
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

  const handleBuyClick = () => {
    const isAlreadyInCart = cart.some(item => item.id === product.id);
    if (isAlreadyInCart) {
      alert("این محصول قبلاً به سبد خرید اضافه شده است!");
      return;
    }
    
    addToCart(product);
  };

  if (isLoading) return <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center font-black">در حال بارگذاری...</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            <div>
              <span className="px-3 py-1 bg-purple-50 text-[#6d28d9] text-[10px] font-black rounded-lg mb-4 inline-block">
                {product.category === 'Course' ? 'دوره آموزشی' : product.category === 'License' ? 'لایسنس' : 'کتاب / فایل'}
              </span>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-sm font-bold text-gray-400 mt-2">فروشنده: {product.seller?.storeName || product.seller?.fullName}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-2">توضیحات محصول</h3>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="p-6 bg-gradient-to-b from-purple-50 to-white rounded-3xl border border-purple-100/50 shadow-sm text-center">
              <span className="block text-xs font-bold text-gray-500 mb-1">قیمت نهایی</span>
              <span className="text-3xl font-black text-[#6d28d9]">{product.price.toLocaleString('en-US')} <span className="text-sm">تومان</span></span>
              
              <button onClick={handleBuyClick} className="w-full mt-6 py-3.5 bg-[#6320ee] hover:bg-[#521ac4] text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                افزودن به سبد خرید
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}