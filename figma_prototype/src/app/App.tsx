import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { ProductList } from "./components/ProductList";
import { ProductDetail } from "./components/ProductDetail";
import { UserDashboard } from "./components/UserDashboard";
import { PricingPage } from "./components/PricingPage";
import { Checkout } from "./components/Checkout";
import { AdminPanel } from "./components/AdminPanel";
import { AuthPage } from "./components/AuthPage";

type Page =
  | "landing"
  | "products"
  | "product-detail"
  | "dashboard"
  | "pricing"
  | "checkout"
  | "admin"
  | "auth";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  /* MARKER-MAKE-KIT-INVOKED */
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [pageData, setPageData] = useState<unknown>(null);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const navigate = (page: string, data?: unknown) => {
    setCurrentPage(page as Page);
    setPageData(data ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setUser(null);
    navigate("landing");
  };

  return (
    <div className="min-h-screen bg-background font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {currentPage !== "auth" && (
        <Header
          currentPage={currentPage}
          onNavigate={navigate}
          isDark={isDark}
          onToggleDark={() => setIsDark(p => !p)}
          user={user}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <main>
        {currentPage === "landing" && (
          <LandingPage onNavigate={navigate} />
        )}

        {currentPage === "products" && (
          <ProductList onNavigate={navigate} searchQuery={searchQuery} />
        )}

        {currentPage === "product-detail" && pageData && (
          <ProductDetail product={pageData as Parameters<typeof ProductDetail>[0]["product"]} onNavigate={navigate} />
        )}

        {currentPage === "dashboard" && (
          user ? (
            <UserDashboard user={user} onNavigate={navigate} />
          ) : (
            <AuthPage onLogin={setUser} onNavigate={navigate} />
          )
        )}

        {currentPage === "pricing" && (
          <PricingPage onNavigate={navigate} />
        )}

        {currentPage === "checkout" && (
          user ? (
            <Checkout checkoutData={pageData as Parameters<typeof Checkout>[0]["checkoutData"]} onNavigate={navigate} />
          ) : (
            <AuthPage onLogin={u => { setUser(u); navigate("checkout", pageData); }} onNavigate={navigate} />
          )
        )}

        {currentPage === "admin" && (
          user?.role === "admin" ? (
            <AdminPanel onNavigate={navigate} />
          ) : (
            <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-foreground font-semibold mb-2">دسترسی محدود</h2>
                <p className="text-muted-foreground text-sm mb-4">برای دسترسی به پنل ادمین باید با حساب مدیر وارد شوید.</p>
                <button onClick={() => navigate("auth")} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">ورود</button>
              </div>
            </div>
          )
        )}

        {currentPage === "auth" && (
          <AuthPage onLogin={setUser} onNavigate={navigate} />
        )}
      </main>

      {/* Toast area placeholder */}
      <div className="fixed bottom-4 left-4 z-50" />
    </div>
  );
}
