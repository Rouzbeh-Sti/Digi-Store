import { useState } from "react";
import { Users, Key, Package, BarChart3, Search, MoreVertical, TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const salesData = [
  { month: "مهر", revenue: 4200000, orders: 38 },
  { month: "آبان", revenue: 5800000, orders: 52 },
  { month: "آذر", revenue: 4900000, orders: 44 },
  { month: "دی", revenue: 7200000, orders: 65 },
  { month: "بهمن", revenue: 6100000, orders: 55 },
  { month: "اسفند", revenue: 8900000, orders: 80 },
  { month: "فروردین", revenue: 7400000, orders: 67 },
];

const users = [
  { id: 1, name: "علی محمدی", email: "ali@example.com", licenses: 3, status: "active", joined: "۱۴۰۲/۸/۱۵", plan: "Pro" },
  { id: 2, name: "سارا رضایی", email: "sara@example.com", licenses: 1, status: "active", joined: "۱۴۰۲/۹/۲", plan: "Basic" },
  { id: 3, name: "محمد احمدی", email: "m.ahmadi@corp.com", licenses: 12, status: "active", joined: "۱۴۰۲/۷/۱", plan: "Enterprise" },
  { id: 4, name: "فاطمه کریمی", email: "f.karimi@example.com", licenses: 2, status: "suspended", joined: "۱۴۰۲/۱۰/۱۲", plan: "Pro" },
  { id: 5, name: "رضا نوری", email: "r.nouri@startup.io", licenses: 5, status: "active", joined: "۱۴۰۳/۱/۱", plan: "Pro" },
];

const licensesList = [
  { id: "LIC-8821", product: "Adobe Creative Cloud", user: "علی محمدی", status: "active", expiry: "۱۴۰۳/۱۲/۲۹", plan: "سالانه" },
  { id: "LIC-8720", product: "GitHub Copilot", user: "سارا رضایی", status: "active", expiry: "۱۴۰۳/۲/۱۵", plan: "ماهانه" },
  { id: "LIC-8654", product: "Microsoft 365", user: "محمد احمدی", status: "active", expiry: "۱۴۰۳/۸/۳۰", plan: "سالانه" },
  { id: "LIC-8501", product: "Figma Pro", user: "فاطمه کریمی", status: "suspended", expiry: "۱۴۰۳/۳/۱۵", plan: "ماهانه" },
  { id: "LIC-8410", product: "Notion Teams", user: "رضا نوری", status: "expired", expiry: "۱۴۰۲/۱۲/۱", plan: "سالانه" },
];

const adminTabs = ["داشبورد", "کاربران", "لایسنس‌ها", "محصولات", "گزارش فروش"];

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchUser, setSearchUser] = useState("");

  const filteredUsers = users.filter(u =>
    u.name.includes(searchUser) || u.email.includes(searchUser)
  );

  const stats = [
    { label: "کل کاربران", value: "۱۲,۴۸۷", change: "+۱۲٪", icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
    { label: "درآمد این ماه", value: "۸۹M ت", change: "+۲۳٪", icon: DollarSign, color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
    { label: "لایسنس فعال", value: "۸۵,۲۱۲", change: "+۸٪", icon: Key, color: "text-primary bg-secondary" },
    { label: "نرخ تمدید", value: "۸۷٪", change: "+۴٪", icon: RefreshCw, color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-foreground font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4rem' }}>پنل مدیریت</h1>
            <p className="text-muted-foreground text-sm mt-0.5">نمای کلی سیستم DigiStore</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            دانلود گزارش
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6 overflow-x-auto">
          {adminTabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === i ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard tab */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="text-foreground mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>{s.value}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">{s.label}</span>
                    <span className="text-xs text-green-500 font-medium">{s.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-foreground font-semibold mb-4">درآمد ماهانه (تومان)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(0) + "M"} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(v: number) => [v.toLocaleString("fa-IR") + " ت", "درآمد"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6d28d9" fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-foreground font-semibold mb-4">تعداد سفارشات</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="orders" fill="#6d28d9" radius={[4, 4, 0, 0]} name="سفارشات" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-foreground font-semibold mb-4">فعالیت اخیر</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, text: "کاربر جدید ثبت‌نام کرد: محمد کریمی", time: "۵ دقیقه پیش", color: "text-green-500" },
                  { icon: Key, text: "لایسنس Adobe CC برای sarah@example.com صادر شد", time: "۱۵ دقیقه پیش", color: "text-primary" },
                  { icon: AlertTriangle, text: "لایسنس GitHub Copilot (LIC-8720) در ۱۲ روز منقضی می‌شود", time: "۱ ساعت پیش", color: "text-orange-500" },
                  { icon: XCircle, text: "اشتراک کاربر f.karimi تعلیق شد", time: "۳ ساعت پیش", color: "text-destructive" },
                  { icon: DollarSign, text: "پرداخت ۱,۲۵۰,۰۰۰ تومان از محمد احمدی دریافت شد", time: "۵ ساعت پیش", color: "text-green-500" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <a.icon className={`w-4 h-4 ${a.color} shrink-0`} />
                    <span className="text-sm text-foreground flex-1">{a.text}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجوی کاربر..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90">
                افزودن کاربر
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">کاربر</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden md:table-cell">پلن</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden sm:table-cell">لایسنس</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">وضعیت</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground hidden lg:table-cell">تاریخ عضویت</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.plan === "Enterprise" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                          u.plan === "Pro" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-muted text-muted-foreground"
                        }`}>{u.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.licenses}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          u.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {u.status === "active" ? "فعال" : "تعلیق"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{u.joined}</td>
                      <td className="px-4 py-3">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Licenses tab */}
        {activeTab === 2 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-foreground font-semibold">مدیریت لایسنس‌ها</h2>
              <div className="flex gap-2">
                {["همه", "فعال", "تعلیق", "منقضی"].map(f => (
                  <button key={f} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">{f}</button>
                ))}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["شناسه", "محصول", "کاربر", "وضعیت", "پلن", "انقضا", "عملیات"].map(h => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {licensesList.map(l => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground text-xs">{l.product}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{l.user}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        l.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        l.status === "suspended" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {l.status === "active" ? "فعال" : l.status === "suspended" ? "تعلیق" : "منقضی"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{l.plan}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{l.expiry}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-primary hover:underline">ویرایش</button>
                        <button className="text-xs text-destructive hover:underline">لغو</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products tab */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-foreground font-semibold">مدیریت محصولات</h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90">
                افزودن محصول
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Adobe Creative Cloud", cat: "طراحی", price: 89000, licenses: 1241, color: "from-red-500 to-orange-500" },
                { name: "Microsoft 365", cat: "بهره‌وری", price: 125000, licenses: 3821, color: "from-blue-500 to-cyan-500" },
                { name: "GitHub Copilot", cat: "توسعه", price: 38000, licenses: 2145, color: "from-slate-600 to-slate-800" },
              ].map(p => (
                <div key={p.name} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold`}>{p.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.cat}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p.licenses.toLocaleString("fa-IR")} لایسنس</span>
                    <span className="text-primary font-semibold">{p.price.toLocaleString("fa-IR")} ت/ماه</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 text-xs py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">ویرایش</button>
                    <button className="flex-1 text-xs py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">آنالیز</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales report tab */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "فروش کل", value: "۴۴,۵۰۰,۰۰۰ ت", icon: DollarSign },
                { label: "سفارشات", value: "۴۰۱", icon: Package },
                { label: "میانگین سفارش", value: "۱۱۰,۰۰۰ ت", icon: TrendingUp },
                { label: "نرخ رشد", value: "+۲۳٪", icon: Activity },
              ].map(s => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
                  <s.icon className="w-5 h-5 text-primary mb-2" />
                  <div className="text-foreground font-bold mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.value}</div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-foreground font-semibold mb-4">روند فروش ۷ ماه اخیر</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(1) + "M"} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(v: number) => [v.toLocaleString("fa-IR") + " ت", "درآمد"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6d28d9" fill="url(#colorRev2)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
