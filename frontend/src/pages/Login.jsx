import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    // Hide toast automatically after 3.5 seconds if no redirect happens
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setToast({ show: false, message: '', type: '' }); // Reset toast

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast(`خوش آمدید ${data.user.fullName}!`, 'success');
        
        // Role-based redirection after a short delay
        setTimeout(() => {
          if (data.user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else if (data.user.role === 'SELLER') {
            navigate('/seller/dashboard');
          } else {
            navigate('/'); // BUYER redirects to home
          }
        }, 1500);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Network failure details:', error);
      showToast('خطا در اتصال به سرور. مطمئن شوید بک‌اَند روشن است.', 'error');
    }
  };

  return (
    <AuthLayout>
      {/* Animated Top Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-3 rounded-xl shadow-2xl transition-all duration-500 ease-out flex items-center gap-3 text-xs font-black ${
        toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${
        toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
      }`}>
        <span className="text-base">{toast.type === 'success' ? '✅' : '⚠️'}</span>
        {toast.message}
      </div>

      <div className="w-full max-w-sm p-5">
        <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">خوش برگشتید</h2>
        <p className="text-gray-400 mb-8 text-xs font-medium">برای ادامه مدیریت دارایی‌ها وارد حساب خود شوید</p>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">ایمیل کاربری</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] focus:ring-2 focus:ring-purple-50 transition-all text-xs font-semibold"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">رمز عبور</label>
            <input 
              type="password" 
              placeholder="حداقل ۸ کاراکتر امنیتی"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] focus:ring-2 focus:ring-purple-50 transition-all text-xs font-semibold"
              required 
            />
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#6320ee] hover:bg-[#4b14b8] text-white font-black rounded-xl transition-all text-xs shadow-lg shadow-purple-100 cursor-pointer mt-2">
            ورود به سیستم ←
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          هنوز حساب کاربری ندارید؟{' '}
          <Link to="/register" className="text-[#6320ee] hover:underline font-black">
            ثبت‌نام رایگان بازارچه
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}