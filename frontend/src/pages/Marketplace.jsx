import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read initial category filter from URL query string if present, default to 'All'
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Course', 'Book', 'License'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sync state if URL query params change dynamically
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">بازارچه محصولات</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">جدیدترین دوره‌ها، نرم‌افزارها و کتاب‌های دیجیتال</p>
          </div>
          
          <div className="w-full md:w-96 relative shadow-sm rounded-xl">
            <input 
              type="text" 
              placeholder="جستجوی محصول..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3.5 pr-12 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#6320ee] transition-all text-xs font-bold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#6320ee] text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6320ee] hover:text-[#6320ee]'
              }`}
            >
              {cat === 'All' ? 'همه محصولات' : cat === 'Course' ? '📚 دوره‌ها' : cat === 'Book' ? '📄 کتاب‌ها' : '🔑 لایسنس‌ها'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-bold text-sm">در حال بارگذاری محصولات...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold text-sm">محصولی با این مشخصات یافت نشد!</div>
        )}
      </div>
    </div>
  );
}