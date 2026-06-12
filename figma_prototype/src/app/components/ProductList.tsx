import { useState, useMemo } from "react";
import { Star, Search, SlidersHorizontal, Grid3X3, List, ArrowUpDown, ChevronDown } from "lucide-react";

const allProducts = [
  { id: 1, name: "Adobe Creative Cloud", category: "طراحی", price: 89000, rating: 4.8, reviews: 2341, badge: "پرفروش", color: "from-red-500 to-orange-500", desc: "مجموعه کامل ابزارهای طراحی خلاقانه شامل Photoshop، Illustrator، Premiere و بیشتر" },
  { id: 2, name: "Microsoft 365 Business", category: "بهره‌وری", price: 125000, rating: 4.9, reviews: 5621, badge: "توصیه شده", color: "from-blue-500 to-cyan-500", desc: "اشتراک کامل آفیس با ابزارهای همکاری تیمی در فضای ابری" },
  { id: 3, name: "Figma Professional", category: "طراحی", price: 64000, rating: 4.7, reviews: 1823, badge: "جدید", color: "from-violet-500 to-purple-600", desc: "طراحی رابط کاربری و نمونه‌سازی تعاملی برای تیم‌های محصول" },
  { id: 4, name: "JetBrains All Products", category: "توسعه", price: 148000, rating: 4.9, reviews: 3412, badge: "محبوب", color: "from-pink-500 to-rose-500", desc: "تمام IDEهای JetBrains برای توسعه‌دهندگان حرفه‌ای" },
  { id: 5, name: "Notion Teams", category: "بهره‌وری", price: 42000, rating: 4.6, reviews: 4231, badge: "", color: "from-gray-600 to-gray-800", desc: "مدیریت پروژه، یادداشت‌برداری و پایگاه دانش تیمی" },
  { id: 6, name: "Slack Pro", category: "ارتباطات", price: 55000, rating: 4.5, reviews: 8721, badge: "", color: "from-purple-500 to-fuchsia-500", desc: "ارتباطات تیمی ساده‌تر با کانال‌ها، جلسات و یکپارچه‌سازی‌ها" },
  { id: 7, name: "GitHub Copilot", category: "توسعه", price: 38000, rating: 4.8, reviews: 12543, badge: "پرطرفدار", color: "from-slate-600 to-slate-800", desc: "دستیار هوش مصنوعی برای کدنویسی سریع‌تر و دقیق‌تر" },
  { id: 8, name: "Zoom Business", category: "ارتباطات", price: 72000, rating: 4.4, reviews: 9812, badge: "", color: "from-blue-400 to-blue-600", desc: "جلسات ویدیویی حرفه‌ای با ضبط ابری و وایت‌بورد" },
  { id: 9, name: "Canva Pro", category: "طراحی", price: 35000, rating: 4.6, reviews: 6723, badge: "", color: "from-teal-400 to-emerald-500", desc: "طراحی گرافیک آسان برای محتوای شبکه‌های اجتماعی و بازاریابی" },
  { id: 10, name: "Datadog Pro", category: "آنالیتیکس", price: 195000, rating: 4.7, reviews: 1231, badge: "", color: "from-orange-500 to-amber-500", desc: "مانیتورینگ، لاگ‌گیری و APM برای زیرساخت‌های ابری" },
  { id: 11, name: "1Password Teams", category: "امنیت", price: 48000, rating: 4.9, reviews: 3421, badge: "توصیه شده", color: "from-blue-600 to-indigo-600", desc: "مدیریت رمز عبور تیمی با به‌اشتراک‌گذاری امن و ورود یکپارچه" },
  { id: 12, name: "ChatGPT Plus", category: "هوش مصنوعی", price: 85000, rating: 4.8, reviews: 15234, badge: "پرفروش", color: "from-green-500 to-teal-500", desc: "دسترسی به GPT-4 با سرعت بیشتر، پلاگین‌ها و DALL·E 3" },
];

const cats = ["همه", "طراحی", "توسعه", "بهره‌وری", "ارتباطات", "آنالیتیکس", "امنیت", "هوش مصنوعی"];

interface ProductListProps {
  onNavigate: (page: string, data?: unknown) => void;
  searchQuery: string;
}

export function ProductList({ onNavigate, searchQuery }: ProductListProps) {
  const [category, setCategory] = useState("همه");
  const [sort, setSort] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const filtered = useMemo(() => {
    let p = allProducts;
    const q = localSearch || searchQuery;
    if (q) p = p.filter(x => x.name.toLowerCase().includes(q.toLowerCase()) || x.category.includes(q));
    if (category !== "همه") p = p.filter(x => x.category === category);
    if (priceRange === "low") p = p.filter(x => x.price < 50000);
    else if (priceRange === "mid") p = p.filter(x => x.price >= 50000 && x.price < 100000);
    else if (priceRange === "high") p = p.filter(x => x.price >= 100000);
    if (sort === "rating") p = [...p].sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc") p = [...p].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") p = [...p].sort((a, b) => b.price - a.price);
    else if (sort === "reviews") p = [...p].sort((a, b) => b.reviews - a.reviews);
    return p;
  }, [category, sort, priceRange, localSearch, searchQuery]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-foreground mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>محصولات</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} محصول یافت شد</p>
        </div>

        {/* Search + controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="جستجو در محصولات..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="rating">بهترین امتیاز</option>
              <option value="reviews">بیشترین نظر</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
            </select>
            <button
              onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
              className="px-3 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Price filter */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "همه قیمت‌ها" },
            { key: "low", label: "زیر ۵۰ هزار" },
            { key: "mid", label: "۵۰-۱۰۰ هزار" },
            { key: "high", label: "بالای ۱۰۰ هزار" },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPriceRange(p.key as typeof priceRange)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                priceRange === p.key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate("product-detail", p)}
                className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all text-right group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} mb-4 flex items-center justify-center text-white font-bold`}>
                  {p.name.charAt(0)}
                </div>
                {p.badge && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium mb-2">{p.badge}</span>
                )}
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{p.category}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-foreground">{p.rating}</span>
                  <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString("fa-IR")})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{p.price.toLocaleString("fa-IR")} ت</span>
                  <span className="text-xs text-muted-foreground">/ ماه</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate("product-detail", p)}
                className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all text-right flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold shrink-0`}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                    {p.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{p.badge}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{p.rating}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-primary">{p.price.toLocaleString("fa-IR")} ت</div>
                  <div className="text-xs text-muted-foreground">/ ماه</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
