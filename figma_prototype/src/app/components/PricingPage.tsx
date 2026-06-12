import { useState } from "react";
import { Check, X, Zap, Shield, Users, Headphones } from "lucide-react";

const plans = [
  {
    key: "basic",
    name: "Basic",
    monthlyPrice: 49000,
    yearlyPrice: 490000,
    desc: "مناسب برای افراد و فریلنسرها",
    icon: Zap,
    color: "border-border",
    featured: false,
    features: [
      { label: "تا ۳ لایسنس همزمان", included: true },
      { label: "مدیریت اشتراک پایه", included: true },
      { label: "داشبورد ساده", included: true },
      { label: "اعلان ایمیلی", included: true },
      { label: "دانلود فاکتور", included: true },
      { label: "API دسترسی", included: false },
      { label: "مدیریت تیمی", included: false },
      { label: "پشتیبانی اختصاصی", included: false },
      { label: "گزارش پیشرفته", included: false },
      { label: "SLA ۹۹.۹٪", included: false },
    ],
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 125000,
    yearlyPrice: 1250000,
    desc: "مناسب برای تیم‌های کوچک و متوسط",
    icon: Shield,
    color: "border-primary",
    featured: true,
    features: [
      { label: "تا ۲۰ لایسنس همزمان", included: true },
      { label: "مدیریت اشتراک پیشرفته", included: true },
      { label: "داشبورد حرفه‌ای", included: true },
      { label: "اعلان ایمیل و پیامک", included: true },
      { label: "دانلود فاکتور رسمی", included: true },
      { label: "API دسترسی", included: true },
      { label: "مدیریت تیمی", included: true },
      { label: "پشتیبانی اختصاصی", included: true },
      { label: "گزارش پیشرفته", included: false },
      { label: "SLA ۹۹.۹٪", included: false },
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthlyPrice: 350000,
    yearlyPrice: 3500000,
    desc: "برای سازمان‌ها و شرکت‌های بزرگ",
    icon: Users,
    color: "border-border",
    featured: false,
    features: [
      { label: "لایسنس نامحدود", included: true },
      { label: "مدیریت اشتراک enterprise", included: true },
      { label: "داشبورد سازمانی", included: true },
      { label: "همه کانال‌های اعلان", included: true },
      { label: "دانلود فاکتور + سند مالی", included: true },
      { label: "API + Webhook", included: true },
      { label: "مدیریت تیمی نامحدود", included: true },
      { label: "مدیر حساب اختصاصی", included: true },
      { label: "گزارش پیشرفته و آنالیتیکس", included: true },
      { label: "SLA ۹۹.۹٪ + اولویت", included: true },
    ],
  },
];

interface PricingPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-foreground mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            قیمت‌گذاری شفاف،<br />بدون هزینه پنهان
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">همه پلن‌ها شامل ۱۴ روز آزمایش رایگان هستند. کارت بانکی نیاز نیست.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center p-1 bg-muted rounded-xl gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${billing === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              سالانه
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">۲ ماه رایگان</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map(p => {
            const price = billing === "monthly" ? p.monthlyPrice : p.yearlyPrice;
            return (
              <div
                key={p.key}
                className={`bg-card rounded-2xl border-2 ${p.color} p-6 relative flex flex-col ${p.featured ? "shadow-xl shadow-primary/10" : ""}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    محبوب‌ترین
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl ${p.featured ? "bg-primary/10" : "bg-secondary"} flex items-center justify-center mb-4`}>
                  <p.icon className={`w-5 h-5 ${p.featured ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-foreground font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem' }}>{p.name}</h3>
                <p className="text-muted-foreground text-xs mb-4">{p.desc}</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.8rem' }}>
                      {price.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-muted-foreground text-sm">ت</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{billing === "monthly" ? "در ماه" : "در سال"}</p>
                </div>
                <button
                  onClick={() => onNavigate("checkout", { plan: p.key, billing, price })}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 mb-6 ${
                    p.featured ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {p.key === "enterprise" ? "تماس با فروش" : "شروع رایگان"}
                </button>
                <div className="flex-1 space-y-2.5">
                  {p.features.map(f => (
                    <div key={f.label} className="flex items-center gap-2">
                      {f.included ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted shrink-0" />
                      )}
                      <span className={`text-xs ${f.included ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison note */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-foreground font-semibold mb-1">نیاز به پلن سفارشی دارید؟</h3>
            <p className="text-muted-foreground text-sm">برای سازمان‌های بزرگ با نیازهای خاص، با تیم فروش ما صحبت کنید.</p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
            تماس با ما
          </button>
        </div>
      </div>
    </div>
  );
}
