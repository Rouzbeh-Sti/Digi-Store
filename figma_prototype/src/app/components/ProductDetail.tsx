import { useState } from "react";
import { Star, Shield, Zap, Users, Check, ArrowLeft, ExternalLink, Download } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  color: string;
  desc: string;
}

interface ProductDetailProps {
  product: Product;
  onNavigate: (page: string, data?: unknown) => void;
}

const plans = [
  {
    key: "monthly",
    label: "ماهانه",
    multiplier: 1,
    badge: "",
  },
  {
    key: "yearly",
    label: "سالانه",
    multiplier: 10,
    badge: "۲ ماه رایگان",
  },
];

const features = [
  "دسترسی کامل به همه ابزارها",
  "به‌روزرسانی خودکار",
  "پشتیبانی ۲۴/۷",
  "ذخیره‌سازی ابری ۱ ترابایت",
  "همکاری تیمی نامحدود",
  "صدور فاکتور رسمی",
];

const reviews = [
  { name: "علی محمدی", rating: 5, date: "۱۴۰۳/۱/۱۵", text: "واقعاً بهترین خرید امسالم بود. کیفیت عالی و قیمت مناسب." },
  { name: "سارا رضایی", rating: 4, date: "۱۴۰۳/۱/۸", text: "خوب بود ولی کاش پشتیبانی فارسی داشت. در کل راضی هستم." },
  { name: "محمد احمدی", rating: 5, date: "۱۴۰۲/۱۲/۲۰", text: "قیمت منصفانه و دریافت لایسنس فوری. پیشنهاد می‌کنم." },
];

export function ProductDetail({ product, onNavigate }: ProductDetailProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const price = billingCycle === "monthly" ? product.price : product.price * 10;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate("landing")} className="hover:text-foreground transition-colors">خانه</button>
          <span>/</span>
          <button onClick={() => onNavigate("products")} className="hover:text-foreground transition-colors">محصولات</button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: product info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
                  {product.name.charAt(0)}
                </div>
                <div>
                  {product.badge && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium mb-2">{product.badge}</span>
                  )}
                  <h1 className="text-foreground mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.4rem' }}>{product.name}</h1>
                  <p className="text-muted-foreground text-sm">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                  <span className="text-sm font-medium text-foreground mr-1">{product.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">{product.reviews.toLocaleString("fa-IR")} نظر</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{product.desc}</p>
            </div>

            {/* Features */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-foreground font-semibold mb-4">ویژگی‌های اشتراک</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "پرداخت امن", sub: "SSL ۲۵۶ بیت" },
                { icon: Zap, label: "دریافت فوری", sub: "کمتر از ۳۰ ثانیه" },
                { icon: Users, label: "پشتیبانی", sub: "۲۴ ساعت / ۷ روز" },
              ].map(t => (
                <div key={t.label} className="bg-card rounded-xl border border-border p-3 text-center">
                  <t.icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.sub}</p>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-foreground font-semibold mb-4">نظرات کاربران</h2>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{r.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: pricing card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-20">
              {/* Billing toggle */}
              <div className="flex items-center p-1 bg-muted rounded-xl mb-6">
                {plans.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setBillingCycle(p.key as "monthly" | "yearly")}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      billingCycle === p.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                    {p.badge && (
                      <span className="block text-xs text-primary font-normal">{p.badge}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2rem' }}>
                    {price.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-muted-foreground text-sm">تومان</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {billingCycle === "monthly" ? "پرداخت ماهانه" : "پرداخت سالانه — معادل " + product.price.toLocaleString("fa-IR") + " تومان / ماه"}
                </p>
              </div>

              <button
                onClick={() => onNavigate("checkout", { product, billingCycle })}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                خرید اشتراک
              </button>
              <button className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity text-sm">
                امتحان رایگان ۱۴ روزه
              </button>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500" /> لغو اشتراک در هر زمان
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500" /> ضمانت بازگشت ۳۰ روزه
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500" /> دریافت فاکتور رسمی
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
