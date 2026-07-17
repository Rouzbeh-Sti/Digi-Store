import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { addToCart, cart } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Fetch product and reviews from API
  const fetchData = async () => {
    try {
      // Fetch product details
      const productRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
      if (!productRes.ok) {
        navigate('/marketplace');
        return;
      }
      const productData = await productRes.json();
      setProduct(productData);

      // Fetch product reviews
      const reviewsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Failed to fetch page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate]);

  const handleBuyClick = () => {
    const isAlreadyInCart = cart.some(item => item.id === product.id);
    if (isAlreadyInCart) {
      alert("این محصول قبلاً به سبد خرید اضافه شده است!");
      return;
    }
    addToCart(product);
  };

  // Submit new product review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage({ text: 'برای ثبت نظر ابتدا باید وارد حساب کاربری شوید.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setComment('');
        setRating(5);
        // Refresh data to reflect new average score and count
        fetchData(); 
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'خطا در ارتباط با سرور.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center font-black">در حال بارگذاری...</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        
        {/* Main Product Panel */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row gap-8 mb-8">
          
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
              
              {/* Rating metrics badge */}
              <div className="mt-4 flex items-center justify-center gap-2 bg-white py-2 px-3 rounded-2xl border border-purple-100/50 text-xs font-black text-gray-700">
                <span className="text-amber-500 text-sm">⭐ {product.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-300">|</span>
                <span className="text-[10px] text-gray-400 font-bold">{product.reviewCount || 0} نظر خریداران</span>
              </div>

              <button onClick={handleBuyClick} className="w-full mt-6 py-3.5 bg-[#6320ee] hover:bg-[#521ac4] text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                افزودن به سبد خرید
              </button>
            </div>
          </div>

        </div>

        {/* Reviews and Ratings Subsection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* List of product comments */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-black text-gray-900">💬 نظرات خریداران ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                هنوز هیچ نظری برای این محصول ثبت نشده است.
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-right">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-gray-800">{rev.user?.fullName}</span>
                      <span className="text-xs text-amber-500 font-black">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 leading-relaxed">{rev.comment || "بدون توضیحات متنی."}</p>
                    <span className="block text-[9px] text-gray-400 mt-2 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Review Form Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <h2 className="text-lg font-black text-gray-900 mb-4">✍️ ثبت بازخورد و امتیاز علمی</h2>
            
            {!token ? (
              <div className="py-8 text-center text-xs font-bold text-gray-400 bg-purple-50/30 rounded-2xl border border-purple-100/50">
                جهت ثبت امتیاز و نظر کاربری، ابتدا وارد حساب کاربری خود شوید.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Rating selection stars */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">امتیاز شما به این محصول:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${
                          num <= rating ? 'text-amber-500' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment textarea text input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">متن نظر یا بازخورد شما</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="نظرات، انتقادات یا نحوه تدریس/کیفیت فایل را بنویسید..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold h-24 resize-none focus:outline-none focus:border-[#6320ee]"
                    required
                  />
                </div>

                {/* Response notification alert banner */}
                {message.text && (
                  <div className={`p-3 rounded-xl text-xs font-black border ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ارسال بازخورد...' : '🚀 ثبت نهایی نظر علمی'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}