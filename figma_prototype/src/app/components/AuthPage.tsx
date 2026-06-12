import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";

interface AuthPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
  onNavigate: (page: string) => void;
}

export function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const isAdmin = email.includes("admin");
      onLogin({
        name: name || (isAdmin ? "مدیر سیستم" : "کاربر نمونه"),
        email: email || "user@example.com",
        role: isAdmin ? "admin" : "user",
      });
      setLoading(false);
      onNavigate(isAdmin ? "admin" : "dashboard");
    }, 1000);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: "کاربر گوگل", email: "google.user@gmail.com", role: "user" });
      setLoading(false);
      onNavigate("dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2rem' }}>
            DigiStore
          </h2>
          <p className="text-white/80 max-w-xs leading-relaxed">
            مدیریت هوشمند لایسنس‌های نرم‌افزاری برای افراد و تیم‌ها
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 max-w-xs mx-auto text-right">
            {[
              "دریافت لایسنس فوری پس از پرداخت",
              "مدیریت متمرکز همه اشتراک‌ها",
              "تمدید خودکار قبل از انقضا",
              "پشتیبانی ۲۴ ساعته فارسی",
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>DigiStore</span>
          </div>

          <h1 className="text-foreground mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.6rem' }}>
            {mode === "login" ? "خوش برگشتید" : "ایجاد حساب رایگان"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {mode === "login" ? "برای ادامه وارد حساب خود شوید" : "همین امروز شروع کنید — بدون کارت بانکی"}
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors mb-4 text-sm font-medium text-foreground"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ادامه با Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">یا</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">نام کامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="احمد کریمی"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {mode === "login" && (
                <p className="text-xs text-muted-foreground mt-1">نکته: برای ورود به پنل ادمین از ایمیل حاوی "admin" استفاده کنید</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="حداقل ۸ کاراکتر"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-input-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">فراموشی رمز عبور؟</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "ورود" : "ایجاد حساب"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === "login" ? "حساب ندارید؟" : "حساب دارید؟"}{" "}
            <button
              onClick={() => setMode(m => m === "login" ? "signup" : "login")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "ثبت‌نام رایگان" : "ورود"}
            </button>
          </p>

          {mode === "signup" && (
            <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              با ایجاد حساب، با{" "}
              <span className="text-primary">شرایط استفاده</span> و{" "}
              <span className="text-primary">سیاست حریم خصوصی</span> موافقت می‌کنید.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
