import { ArrowLeft, Star, Shield, Zap, Users, BarChart3, Globe, CheckCircle, TrendingUp, Award } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const featuredProducts = [
  { id: 1, name: "Adobe Creative Cloud", category: "طراحی", price: 89000, rating: 4.8, reviews: 2341, badge: "پرفروش", color: "from-red-500 to-orange-500" },
  { id: 2, name: "Microsoft 365 Business", category: "بهره‌وری", price: 125000, rating: 4.9, reviews: 5621, badge: "توصیه شده", color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Figma Professional", category: "طراحی", price: 64000, rating: 4.7, reviews: 1823, badge: "جدید", color: "from-violet-500 to-purple-600" },
  { id: 4, name: "JetBrains All Products", category: "توسعه", price: 148000, rating: 4.9, reviews: 3412, badge: "محبوب", color: "from-pink-500 to-rose-500" },
];

const categories = [
  { icon: "🎨", label: "طراحی", count: 48 },
  { icon: "💻", label: "توسعه", count: 93 },
  { icon: "📊", label: "آنالیتیکس", count: 31 },
  { icon: "🔐", label: "امنیت", count: 27 },
  { icon: "🤖", label: "هوش مصنوعی", count: 55 },
  { icon: "📱", label: "موبایل", count: 42 },
];



export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 border border-border">
            <Zap className="w-3.5 h-3.5" />
            سریع‌ترین پلتفرم مدیریت لایسنس نرم‌افزار
          </div>
          <h1 className="mb-6 text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15 }}>
            نرم‌افزار مورد نیاز خود را<br />
            <span style={{ background: 'linear-gradient(135deg, #6d28d9, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              هوشمندانه مدیریت کنید
            </span>
          </h1>
          <p className="mb-8 text-muted-foreground max-w-xl mx-auto" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            بیش از ۳۵۰ محصول نرم‌افزاری، مدیریت لایسنس، اشتراک و تمدید خودکار — همه در یک پلتفرم امن و سریع.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate("products")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2"
            >
              مشاهده محصولات
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("pricing")}
              className="px-6 py-3 bg-card text-foreground rounded-xl font-semibold hover:bg-secondary transition-colors border border-border"
            >
              مشاهده پلن‌ها
            </button>
          </div>
        </div>
      </section>

    

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-foreground mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>دسته‌بندی‌ها</h2>
          <p className="text-muted-foreground mb-8 text-sm">محصول مورد نظر خود را بر اساس دسته‌بندی پیدا کنید</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(c => (
              <button
                key={c.label}
                onClick={() => onNavigate("products")}
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all group"
              >
                <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.count} محصول</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>محصولات برتر</h2>
              <p className="text-muted-foreground text-sm mt-1">پرفروش‌ترین نرم‌افزارها این ماه</p>
            </div>
            <button onClick={() => onNavigate("products")} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              مشاهده همه <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate("product-detail", p)}
                className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all text-right group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} mb-3 flex items-center justify-center text-white text-lg font-bold`}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.badge === "جدید" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    p.badge === "توصیه شده" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-secondary text-secondary-foreground"
                  }`}>{p.badge}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{p.category}</p>
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
        </div>
      </section>

      
      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card rounded-3xl border border-border p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-foreground mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>
                ۱۴ روز رایگان، بدون نیاز به کارت بانکی
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">همین امروز شروع کنید و تمام قابلیت‌های Pro را بدون هیچ محدودیتی تجربه کنید</p>
              <button onClick={() => onNavigate("auth")} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                شروع رایگان
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
