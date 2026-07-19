import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SellerCTA from '../components/SellerCTA';
import Footer from '../components/Footer'; // Import the new Footer component
import RecommendationSection from '../components/RecommendationSection';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [personalRecommendations, setPersonalRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedItems(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching latest products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const fetchPersonalRecommendations = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setRecLoading(false); return; }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setPersonalRecommendations(await response.json());
        }
      } catch (error) {
        console.error('Error fetching personal recommendations:', error);
      } finally {
        setRecLoading(false);
      }
    };
    fetchPersonalRecommendations();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'All') {
      navigate('/marketplace');
    } else {
      navigate(`/marketplace?category=${categoryName}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a] relative flex flex-col" style={{ direction: 'rtl' }}>
      
      {/* Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1">
        <Navbar />

        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Grid Categories Showcase Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <h2 className="text-xl font-black mb-1.5 text-gray-900 tracking-tight">دسته‌بندی محصولات دیجیتال</h2>
          <p className="text-xs font-bold text-gray-400 mb-8">کالای یادگیری یا ابزار کاربردی خود را انتخاب کنید</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: "🔑", label: "لایسنس و اشتراک اپ", type: "License", count: "تحویل آنی کلید" },
              { icon: "🎓", label: "دوره‌های آموزشی ویدیویی", type: "Course", count: "پخش آنلاین ویدیو" },
              { icon: "📖", label: "کتاب و جزوات الکترونیکی", type: "Book", count: "دانلود فایل PDF" },
              { icon: "📦", label: "همه محصولات بازارچه", type: "All", count: "مشاهده آرشیو کامل" }
            ].map((cat, index) => (
              <div 
                key={index} 
                onClick={() => handleCategoryClick(cat.type)}
                className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xs hover:border-[#6320ee] hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                <h3 className="text-xs font-black text-gray-900 mb-1">{cat.label}</h3>
                <p className="text-[10px] font-bold text-gray-400 tracking-wide">{cat.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Products Cards Feed Section */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">ویترین محصولات برتر بازارچه</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">تضمین لایسنس‌های معتبر قانونی و دسترسی همیشگی به فایل‌ها</p>
            </div>
            <Link to="/marketplace" className="text-xs font-black text-[#6d28d9] hover:underline bg-purple-50 px-3 py-1.5 rounded-xl">مشاهده همه محصولات ←</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-400 font-bold text-xs">در حال بارگذاری محصولات...</div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 font-bold text-xs">هیچ محصولی یافت نشد.</div>
          )}
        </section>
        {/* Personalized Recommendations for Logged-in Users */}
        {!recLoading && personalRecommendations.length > 0 && (
          <RecommendationSection
            title="پیشنهادات ویژه برای شما"
            subtitle="بر اساس خریدهای قبلی و سلیقه کاربران مشابه"
            products={personalRecommendations}
            icon="✨"
          />
        )}

        <SellerCTA />
      </div>

      {/* Render the clean enterprise footer component */}
      <Footer />
    </div>
  );
}