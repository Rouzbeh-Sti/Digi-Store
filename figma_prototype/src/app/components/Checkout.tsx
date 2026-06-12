import { useState } from "react";
import { Check, CreditCard, Lock, ChevronRight, User, Mail, Phone, Building } from "lucide-react";

interface CheckoutProps {
  checkoutData: {
    product?: { name: string; price: number };
    plan?: string;
    billing?: string;
    price?: number;
    billingCycle?: string;
  };
  onNavigate: (page: string, data?: unknown) => void;
}

const steps = ["انتخاب پلن", "اطلاعات", "پرداخت", "تأیید"];

export function Checkout({ checkoutData, onNavigate }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(checkoutData.billing || checkoutData.billingCycle || "monthly");
  const [payMethod, setPayMethod] = useState("card");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const [completed, setCompleted] = useState(false);

  const productName = checkoutData.product?.name || (checkoutData.plan ? `پلن ${checkoutData.plan}` : "اشتراک");
  const basePrice = checkoutData.product?.price || checkoutData.price || 125000;
  const price = selectedPlan === "yearly" ? basePrice * 10 : basePrice;
  const vat = Math.round(price * 0.09);
  const total = price + vat;

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
        <div className="bg-card rounded-3xl border border-border p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-foreground font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4rem' }}>
            خرید موفق!
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            لایسنس {productName} برای ایمیل <strong>{formData.email || "شما"}</strong> ارسال شد. فاکتور رسمی در داشبورد موجود است.
          </p>
          <div className="bg-muted rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">کد سفارش</span>
              <span className="text-foreground font-mono font-medium">ORD-{Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مبلغ پرداختی</span>
              <span className="text-foreground font-semibold">{total.toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            مشاهده داشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-foreground font-bold mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4rem' }}>تکمیل خرید</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i + 1 === step ? "text-primary" : i + 1 < step ? "text-green-500" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i + 1 < step ? "bg-green-500 border-green-500 text-white" :
                  i + 1 === step ? "border-primary text-primary" : "border-border text-muted-foreground"
                }`}>
                  {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 min-w-4 ${i + 1 < step ? "bg-green-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Plan */}
            {step === 1 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-foreground font-semibold mb-4">انتخاب دوره اشتراک</h2>
                <div className="space-y-3">
                  {[
                    { key: "monthly", label: "ماهانه", sublabel: "پرداخت ماه به ماه", price: basePrice },
                    { key: "yearly", label: "سالانه", sublabel: "۲ ماه رایگان — صرفه‌جویی ۱۷٪", price: basePrice * 10 },
                  ].map(p => (
                    <button
                      key={p.key}
                      onClick={() => setSelectedPlan(p.key)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-right ${
                        selectedPlan === p.key ? "border-primary bg-secondary/30" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === p.key ? "border-primary" : "border-border"}`}>
                          {selectedPlan === p.key && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{p.sublabel}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">{p.price.toLocaleString("fa-IR")} ت</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  ادامه
                </button>
              </div>
            )}

            {/* Step 2: Info */}
            {step === 2 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-foreground font-semibold mb-4">اطلاعات صورتحساب</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "نام و نام خانوادگی", icon: User, placeholder: "احمد کریمی" },
                    { key: "email", label: "ایمیل", icon: Mail, placeholder: "ahmad@example.com" },
                    { key: "phone", label: "شماره موبایل", icon: Phone, placeholder: "۰۹۱۲ ۳۴۵ ۶۷۸۹" },
                    { key: "company", label: "نام شرکت (اختیاری)", icon: Building, placeholder: "شرکت نمونه" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                      <div className="relative">
                        <f.icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={(formData as Record<string, string>)[f.key]}
                          onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">
                    قبلی
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm">
                    ادامه
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-foreground font-semibold mb-4">روش پرداخت</h2>
                <div className="flex gap-3 mb-5">
                  {[
                    { key: "card", label: "کارت بانکی" },
                    { key: "wallet", label: "کیف پول" },
                  ].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setPayMethod(m.key)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        payMethod === m.key ? "border-primary bg-secondary/30 text-primary" : "border-border text-muted-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {payMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">شماره کارت</label>
                      <div className="relative">
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          placeholder="۶۲۷۴ ۱۲۱۲ ۱۲۳۴ ۵۶۷۸"
                          className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">تاریخ انقضا</label>
                        <input placeholder="MM/YY" className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">CVV2</label>
                        <input placeholder="●●●" type="password" className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                  </div>
                )}
                {payMethod === "wallet" && (
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">موجودی کیف پول: <span className="text-foreground font-semibold">۵۰۰,۰۰۰ تومان</span></p>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">
                    قبلی
                  </button>
                  <button
                    onClick={() => { setStep(4); setTimeout(() => setCompleted(true), 1500); }}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> پرداخت {total.toLocaleString("fa-IR")} تومان
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-foreground font-medium">در حال پردازش پرداخت...</p>
                <p className="text-muted-foreground text-sm mt-1">لطفاً صبر کنید</p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
              <h3 className="text-foreground font-semibold mb-4">خلاصه سفارش</h3>
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {productName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{productName}</p>
                  <p className="text-xs text-muted-foreground">{selectedPlan === "monthly" ? "اشتراک ماهانه" : "اشتراک سالانه"}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">قیمت پایه</span>
                  <span className="text-foreground">{price.toLocaleString("fa-IR")} ت</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مالیات بر ارزش افزوده (۹٪)</span>
                  <span className="text-foreground">{vat.toLocaleString("fa-IR")} ت</span>
                </div>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-foreground font-semibold">مجموع</span>
                <span className="text-primary font-bold">{total.toLocaleString("fa-IR")} ت</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" /> پرداخت امن با SSL ۲۵۶ بیت
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
