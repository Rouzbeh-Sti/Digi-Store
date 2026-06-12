import { useState } from "react";
import { Search, Bell, Moon, Sun, Menu, X, Zap, User, LogOut, Settings, LayoutDashboard, Shield } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({ currentPage, onNavigate, isDark, onToggleDark, user, onLogout, searchQuery, onSearchChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { key: "landing", label: "خانه" },
    { key: "products", label: "محصولات" },
    { key: "pricing", label: "قیمت‌گذاری" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-md bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem' }}>DigiStore</span>
          </button>

          {/* Search bar – desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="جستجوی محصولات، نرم‌افزار..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => onNavigate("products")}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              dir="rtl"
            />
          </div>

          {/* Nav – desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  currentPage === l.key
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground">{user.name}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <button onClick={() => { onNavigate("dashboard"); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground text-right">
                        <LayoutDashboard className="w-4 h-4" /> داشبورد
                      </button>
                      <button onClick={() => { onNavigate("dashboard"); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground text-right">
                        <Settings className="w-4 h-4" /> تنظیمات
                      </button>
                      {user.role === "admin" && (
                        <button onClick={() => { onNavigate("admin"); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground text-right">
                          <Shield className="w-4 h-4" /> پنل ادمین
                        </button>
                      )}
                      <div className="border-t border-border mt-1">
                        <button onClick={() => { onLogout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive text-right">
                          <LogOut className="w-4 h-4" /> خروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate("auth")}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ورود
                </button>
                <button
                  onClick={() => onNavigate("auth")}
                  className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  ثبت‌نام رایگان
                </button>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search + nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                dir="rtl"
              />
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(l => (
                <button
                  key={l.key}
                  onClick={() => { onNavigate(l.key); setMobileOpen(false); }}
                  className={`px-3 py-2 rounded-lg text-sm text-right transition-colors ${
                    currentPage === l.key ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </button>
              ))}
              {!user && (
                <>
                  <button onClick={() => { onNavigate("auth"); setMobileOpen(false); }} className="px-3 py-2 rounded-lg text-sm text-right text-muted-foreground hover:bg-muted">ورود</button>
                  <button onClick={() => { onNavigate("auth"); setMobileOpen(false); }} className="px-3 py-2 rounded-lg text-sm text-right bg-primary text-primary-foreground font-medium">ثبت‌نام رایگان</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
