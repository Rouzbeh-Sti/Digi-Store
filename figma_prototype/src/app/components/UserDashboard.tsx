import { useState } from "react";
import { Key, RefreshCw, Calendar, AlertCircle, CheckCircle, Clock, Settings, CreditCard, Download, Eye, EyeOff, TrendingUp, Package } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
}

interface UserDashboardProps {
  user: User;
  onNavigate: (page: string, data?: unknown) => void;
}

const licenses = [
  { id: "LIC-2024-001", product: "Adobe Creative Cloud", plan: "سالانه", status: "active", expiry: "۱۴۰۳/۱۲/۲۹", daysLeft: 280, key: "ADCC-XXXX-XXXX-7821", color: "from-red-500 to-orange-500" },
  { id: "LIC-2024-002", product: "GitHub Copilot", plan: "ماهانه", status: "active", expiry: "۱۴۰۳/۲/۱۵", daysLeft: 12, key: "GHC-XXXX-XXXX-3412", color: "from-slate-600 to-slate-800" },
  { id: "LIC-2024-003", product: "Notion Teams", plan: "سالانه", status: "expired", expiry: "۱۴۰۲/۱۱/۳۰", daysLeft: -30, key: "NOT-XXXX-XXXX-9901", color: "from-gray-600 to-gray-800" },
  { id: "LIC-2024-004", product: "Figma Professional", plan: "ماهانه", status: "active", expiry: "۱۴۰۳/۲/۲۸", daysLeft: 25, key: "FIG-XXXX-XXXX-5643", color: "from-violet-500 to-purple-600" },
];

const purchases = [
  { id: "ORD-5821", product: "Adobe Creative Cloud", amount: 890000, date: "۱۴۰۳/۱/۱", status: "completed", plan: "سالانه" },
  { id: "ORD-5720", product: "GitHub Copilot", amount: 38000, date: "۱۴۰۳/۱/۱۵", status: "completed", plan: "ماهانه" },
  { id: "ORD-5654", product: "Figma Professional", amount: 64000, date: "۱۴۰۲/۱۲/۲۸", status: "completed", plan: "ماهانه" },
  { id: "ORD-5501", product: "Notion Teams", amount: 420000, date: "۱۴۰۲/۲/۱", status: "completed", plan: "سالانه" },
];

const tabs = ["لایسنس‌ها", "تاریخچه خریدها", "تنظیمات حساب"];

export function UserDashboard({ user, onNavigate }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (id: string) => setVisibleKeys(p => ({ ...p, [id]: !p[id] }));

  const activeLicenses = licenses.filter(l => l.status === "active").length;
  const expiringSoon = licenses.filter(l => l.status === "active" && l.daysLeft <= 30).length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-foreground mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>
            سلام، {user.name} 👋
          </h1>
          <p className="text-muted-foreground text-sm">خوش آمدید به داشبورد مدیریت لایسنس‌هایتان</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "لایسنس فعال", value: activeLicenses, icon: CheckCircle, color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
            { label: "در حال انقضا", value: expiringSoon, icon: AlertCircle, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20" },
            { label: "کل خریدها", value: purchases.length, icon: Package, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
            { label: "هزینه کل (ت)", value: (totalSpent / 1000).toFixed(0) + "K", icon: TrendingUp, color: "text-primary bg-secondary" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div className="text-foreground mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.4rem' }}>{s.value}</div>
              <div className="text-muted-foreground text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 w-fit">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === i ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Licenses tab */}
        {activeTab === 0 && (
          <div className="space-y-4">
            {licenses.map(lic => (
              <div key={lic.id} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lic.color} flex items-center justify-center text-white font-bold shrink-0`}>
                      {lic.product.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{lic.product}</h3>
                      <p className="text-xs text-muted-foreground">پلن {lic.plan} · {lic.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      lic.status === "active"
                        ? lic.daysLeft <= 30 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {lic.status === "active" ? (lic.daysLeft <= 30 ? `${lic.daysLeft} روز مانده` : "فعال") : "منقضی شده"}
                    </span>
                  </div>
                </div>

                {/* License key */}
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-4">
                  <Key className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <code className="text-xs font-mono flex-1 text-foreground">
                    {visibleKeys[lic.id] ? lic.key : lic.key.replace(/[^-]/g, "●")}
                  </code>
                  <button onClick={() => toggleKey(lic.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {visibleKeys[lic.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expiry */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    انقضا: {lic.expiry}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="w-3.5 h-3.5" /> دانلود
                    </button>
                    {lic.status === "expired" || lic.daysLeft <= 30 ? (
                      <button
                        onClick={() => onNavigate("checkout", { product: { name: lic.product, price: 50000 }, billingCycle: "monthly" })}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> تمدید
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
                        <Settings className="w-3 h-3" /> مدیریت
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar for active licenses */}
                {lic.status === "active" && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${lic.daysLeft <= 30 ? "bg-orange-400" : "bg-primary"}`}
                        style={{ width: `${Math.max(5, (lic.daysLeft / 365) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Purchase history */}
        {activeTab === 1 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-foreground font-semibold">تاریخچه خریدها</h2>
            </div>
            <div className="divide-y divide-border">
              {purchases.map(p => (
                <div key={p.id} className="px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.product}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · پلن {p.plan} · {p.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">تکمیل شده</span>
                    <span className="text-sm font-semibold text-foreground">{p.amount.toLocaleString("fa-IR")} ت</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-foreground font-semibold mb-4">اطلاعات شخصی</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "نام و نام خانوادگی", value: user.name, placeholder: "نام کامل" },
                  { label: "ایمیل", value: user.email, placeholder: "ایمیل" },
                  { label: "شماره تماس", value: "۰۹۱۲ ۳۴۵ ۶۷۸۹", placeholder: "شماره موبایل" },
                  { label: "شرکت", value: "DigiCorp Inc.", placeholder: "نام شرکت" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                    <input
                      defaultValue={f.value}
                      className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                ذخیره تغییرات
              </button>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-foreground font-semibold mb-4">تغییر رمز عبور</h2>
              <div className="space-y-3 max-w-sm">
                {["رمز عبور فعلی", "رمز عبور جدید", "تکرار رمز عبور جدید"].map(l => (
                  <div key={l}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{l}</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                تغییر رمز عبور
              </button>
            </div>

            <div className="bg-card rounded-2xl border border-red-500/20 p-6">
              <h2 className="text-destructive font-semibold mb-2">حذف حساب کاربری</h2>
              <p className="text-muted-foreground text-sm mb-4">با حذف حساب، تمام لایسنس‌ها و اطلاعات شما به‌طور دائم حذف می‌شوند.</p>
              <button className="px-5 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/20 transition-colors border border-destructive/20">
                حذف حساب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
