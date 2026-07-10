import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the specific product details using the ID parameter from the URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          // If the product doesn't exist, redirect the user back to the marketplace
          navigate('/marketplace');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Placeholder function for handling the checkout process
  const handleBuyClick = () => {
    console.log(`Ready to checkout product: ${product.id}`);
    alert("به زودی به درگاه پرداخت متصل می شود.");
  };

  // Show a loading screen while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8fc]" style={{ direction: 'rtl' }}>
        <Navbar />
        <div className="text-center py-32 text-gray-500 font-bold text-sm">در حال بارگذاری اطلاعات محصول...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
          
          {/* Placeholder for the product's main visual/image */}
          <div className="w-full md:w-1/3 h-64 bg-gradient-to-br from-[#6320ee] to-[#863bff] rounded-2xl flex justify-center items-center text-white text-5xl shadow-inner">
            📦
          </div>

          {/* Product text information and checkout actions */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-4">{product.title}</h1>
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                {product.description || "توضیحاتی برای این محصول ثبت نشده است."}
              </p>
              
              <div className="inline-block bg-purple-50 px-4 py-2 rounded-xl mb-6 border border-purple-100">
                <span className="text-xs text-gray-500 font-bold ml-2">فروشنده:</span>
                <span className="text-xs font-black text-[#6d28d9]">{product.seller?.fullName || 'ناشناس'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="text-2xl font-black text-gray-900 mb-4 sm:mb-0">
                {product.price.toLocaleString('en-US')} <span className="text-xs text-gray-500 font-bold">تومان</span>
              </div>
              
              <button 
                onClick={handleBuyClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#6320ee] to-[#863bff] text-white font-black rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                افزودن به سبد خرید
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}