import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';
import RecommendationSection from '../components/RecommendationSection';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Extracting 'cart' alongside 'addToCart' to check existing items
  const { addToCart, cart } = useContext(CartContext);

  // Core data states
  const [product, setProduct] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Review form states
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Recommendation states
  const [productRecommendations, setProductRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const fetchProductAndUserStatus = async () => {
      try {
        // 1. Fetch main product details
        const prodRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        if (prodRes.ok) setProduct(await prodRes.json());

        // 2. Fetch public reviews list
        const reviewsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`);
        if (reviewsRes.ok) setReviews(await reviewsRes.json());

        // 3. If authenticated, check subscription status and purchase history
        const token = localStorage.getItem('token');
        if (token) {
          const subRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            setHasSubscription(subData.hasActiveSubscription);
          }

          const ordersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (ordersRes.ok) {
            const orders = await ordersRes.json();
            const ownsProduct = orders.some(o => 
              o.status === 'COMPLETED' && o.items.some(i => i.productId === parseInt(id))
            );
            setIsPurchased(ownsProduct);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndUserStatus();
  }, [id]);

  useEffect(() => {
    const fetchProductRecommendations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/product/${id}`);
        if (res.ok) setProductRecommendations(await res.json());
      } catch (error) {
        console.error("Error fetching product recommendations:", error);
      } finally {
        setRecLoading(false);
      }
    };
    fetchProductRecommendations();
  }, [id]);

  // Check if the current product is already in the cart
  const inCart = product ? cart.some(item => item.id === product.id && item.type === 'PRODUCT') : false;

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
        setIsPurchased(true);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast("خطایی در ارتباط با سرور رخ داد.", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    // Failsafe to prevent adding if it's already in the cart
    if (inCart) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      type: 'PRODUCT',
      category: product.category
    });
    showToast('محصول به سبد خرید اضافه شد', 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: parseInt(newRating), comment: newComment })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast('نظر شما با موفقیت ثبت شد!', 'success');
        const reviewsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`);
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        setNewComment('');
        setNewRating(5);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('خطا در ارتباط با سرور.', 'error');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">در حال دریافت اطلاعات...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">محصول یافت نشد.</div>;

  const buyerLabel = product.category === 'Course' ? 'دانشجو' : 'خریدار';

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-3 rounded-xl shadow-2xl transition-all duration-500 ease-out flex items-center gap-3 text-xs font-black ${
        toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
        {toast.message}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 sm:gap-10">
          
          {/* Product Info Column */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                {product.category === 'Course' ? '📚 دوره آموزشی' : product.category === 'Book' ? '📄 کتاب و جزوه' : '🔑 لایسنس نرم‌افزار'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">{product.title}</h1>
              <p className="text-sm font-bold text-gray-500 mt-2">فروشنده: {product.seller?.fullName || 'کاربر سیستم'}</p>
              
              {/* Stats: Rating & Buyers Count */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                  <span className="text-amber-500 text-sm">⭐</span>
                  <span className="text-sm font-black text-gray-900">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">
                    ({product.reviewCount || 0} امتیاز)
                  </span>
                </div>
                
                <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 px-3 py-2 rounded-xl">
                  <span className="text-purple-500 text-sm">👥</span>
                  <span className="text-sm font-black text-gray-900">
                    {product.purchaseCount ? product.purchaseCount.toLocaleString('fa-IR') : 0}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">{buyerLabel}</span>
                </div>
              </div>
            </div>
            
            <div className="prose prose-sm text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              {product.description || 'توضیحاتی برای این محصول درج نشده است.'}
            </div>
          </div>

          {/* Purchase / Access Box */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-500 block mb-1">قیمت محصول</span>
                <div className="text-2xl font-black text-[#6d28d9]">
                  {product.price.toLocaleString('fa-IR')} <span className="text-sm text-gray-500 font-normal">تومان</span>
                </div>
              </div>

              {isPurchased ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                    <span className="text-xs font-black text-emerald-700">✅ شما این محصول را خریده‌اید</span>
                  </div>
                  <Link 
                    to="/buyer/dashboard"
                    className="w-full block text-center py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95"
                  >
                    📦 رفتن به کتابخانه من
                  </Link>
                </div>
              ) : (
                <>
                  {product.allowSubscription ? (
                    hasSubscription ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center shadow-sm">
                          <span className="text-xs font-black text-green-700">✨ شما اشتراک دیجی‌کورس دارید</span>
                        </div>
                        <button 
                          onClick={handleClaimWithSubscription}
                          disabled={isProcessing}
                          className="w-full py-3.5 bg-gradient-to-r from-[#6320ee] to-[#863bff] hover:from-[#521ac4] hover:to-[#6d28d9] text-white text-sm font-black rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {isProcessing ? 'در حال فعال‌سازی...' : '📥 دریافت رایگان با اشتراک'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          onClick={handleAddToCart}
                          disabled={inCart}
                          className={`w-full py-3.5 text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                            inCart 
                              ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200' 
                              : 'bg-gray-900 hover:bg-black text-white'
                          }`}
                        >
                          {inCart ? 'در سبد خرید موجود است' : '🛒 افزودن به سبد خرید'}
                        </button>
                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-purple-700 leading-relaxed">
                            💡 با تهیه اشتراک <span className="font-black">دیجی‌کورس</span>، این دوره و ده‌ها دوره دیگر را یکجا دریافت کنید!
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <button 
                      onClick={handleAddToCart}
                      disabled={inCart}
                      className={`w-full py-3.5 text-sm font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                        inCart 
                          ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200' 
                          : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      {inCart ? 'در سبد خرید موجود است' : '🛒 افزودن به سبد خرید'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">💬</span>
            <h3 className="text-xl font-black text-gray-900">نظرات و بازخوردهای کاربران</h3>
          </div>

          {/* Review Form (Verified Buyers Only) */}
          {isPurchased ? (
            <form onSubmit={handleReviewSubmit} className="mb-10 bg-gray-50/50 p-6 rounded-2xl border border-gray-200">
              <h4 className="text-sm font-black text-[#6d28d9] mb-4">ثبت دیدگاه جدید</h4>
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">امتیاز شما به این محصول</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)} 
                  className="w-32 p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-black text-amber-600 focus:outline-none focus:border-[#6d28d9] cursor-pointer shadow-sm"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (۵)</option>
                  <option value="4">⭐⭐⭐⭐ (۴)</option>
                  <option value="3">⭐⭐⭐ (۳)</option>
                  <option value="2">⭐⭐ (۲)</option>
                  <option value="1">⭐ (۱)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">متن دیدگاه</label>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  className="w-full p-4 rounded-xl border border-gray-200 text-xs font-medium h-28 resize-none focus:border-[#6320ee] focus:ring-4 focus:ring-purple-50 transition-all focus:outline-none shadow-sm" 
                  placeholder="تجربه خود را از این محصول بنویسید..." 
                  required
                />
              </div>

              <button type="submit" className="px-8 py-3 bg-[#6320ee] hover:bg-[#521ac4] text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                ارسال دیدگاه
              </button>
            </form>
          ) : (
            <div className="mb-10 p-5 bg-amber-50 text-amber-700 text-xs font-bold rounded-2xl border border-amber-100 flex items-center gap-2">
              <span>⚠️</span>
              تنها کاربرانی که این محصول را خریداری کرده یا از طریق اشتراک دریافت کرده‌اند، مجاز به ثبت نظر هستند.
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? reviews.map(r => (
              <div key={r.id} className="p-5 bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 shadow-sm hover:border-purple-100 transition-colors">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500">
                      {r.user?.fullName ? r.user.fullName.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-black text-gray-900">{r.user?.fullName || 'کاربر سیستم'}</span>
                  </div>
                  <span className="text-xs text-amber-500 font-black">{"⭐".repeat(r.rating)}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            )) : (
              <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <span className="text-3xl opacity-40 block mb-2">🏜️</span>
                <p className="text-xs text-gray-500 font-bold">هنوز نظری برای این محصول ثبت نشده است. شما اولین نفر باشید!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!recLoading && productRecommendations.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <RecommendationSection
            title="خریداران این محصول، این‌ها را هم خریدند"
            subtitle="پیشنهادات هوشمند بر اساس سلیقه کاربران مشابه"
            products={productRecommendations}
            icon="🛒"
          />
        </div>
      )}
    </div>
  );
}