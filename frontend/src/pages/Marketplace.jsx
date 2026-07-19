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
  
  const [sortOption, setSortOption] = useState('newest'); // newest, price_asc, price_desc, popular
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  // 1. apply filters based on search query, selected category, and price range
  let processedProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    const productPrice = product.price || 0;
    const matchesMinPrice = minPrice === '' || productPrice >= parseInt(minPrice);
    const matchesMaxPrice = maxPrice === '' || productPrice <= parseInt(maxPrice);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  //2. sort the filtered products based on the selected sort option
  processedProducts.sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price; 
    if (sortOption === 'price_desc') return b.price - a.price; 
    if (sortOption === 'popular') return (b.purchaseCount || 0) - (a.purchaseCount || 0); 
    // Default: newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // 3. reset filters function
  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortOption('newest');
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">بازارچه محصولات</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">جدیدترین دوره‌ها، نرم‌افزارها و کتاب‌های دیجیتال</p>
          </div>
          
          <div className="w-full md:w-96 relative shadow-sm rounded-xl">
            <input 
              type="text" 
              placeholder="جستجوی عنوان محصول..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3.5 pr-12 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#6320ee] transition-all text-xs font-bold shadow-xs"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Toolbar: Filters and Sorting */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 hide-scrollbar">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#6320ee] text-white shadow-md shadow-purple-200' 
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-[#6320ee] hover:text-[#6320ee]'
                }`}
              >
                {cat === 'All' ? 'همه موارد' : cat === 'Course' ? '📚 دوره‌ها' : cat === 'Book' ? '📄 کتاب‌ها' : '🔑 لایسنس‌ها'}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Price Range Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-500 px-2">قیمت:</span>
              <input 
                type="number" 
                placeholder="از (تومان)" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 p-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee] text-center"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input 
                type="number" 
                placeholder="تا (تومان)" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 p-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#6320ee] text-center"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-40 p-2.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-700 focus:outline-none focus:border-[#6320ee] cursor-pointer shadow-xs"
              >
                <option value="newest">🆕 جدیدترین‌ها</option>
                <option value="price_asc">📉 ارزان‌ترین به گران‌ترین</option>
                <option value="price_desc">📈 گران‌ترین به ارزان‌ترین</option>
                <option value="popular">⭐ محبوب‌ترین‌ها (پرفروش)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(minPrice || maxPrice || sortOption !== 'newest') && (
              <button 
                onClick={resetFilters}
                className="p-2.5 text-[10px] font-black text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer w-full sm:w-auto text-center"
              >
                پاک کردن فیلترها ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-purple-200 border-t-[#6320ee] rounded-full animate-spin"></div>
             <div className="text-gray-500 font-bold text-sm">در حال بارگذاری محصولات...</div>
          </div>
        ) : processedProducts.length > 0 ? (
          <>
            <div className="mb-4 text-xs font-bold text-gray-500">
              نمایش <span className="text-[#6d28d9] font-black">{processedProducts.length}</span> محصول
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              {processedProducts.map((product) => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xs">
            <div className="text-6xl mb-4 opacity-40">🕵️‍♂️</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">محصولی یافت نشد!</h3>
            <p className="text-xs font-bold text-gray-400">با این فیلترها و بازه قیمتی محصولی در بازارچه وجود ندارد.</p>
            <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-purple-50 text-purple-700 text-xs font-black rounded-xl hover:bg-purple-100 transition-colors">
              حذف فیلترها و مشاهده همه
            </button>
          </div>
        )}
      </div>
    </div>
  );
}