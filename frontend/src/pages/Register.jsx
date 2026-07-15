import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'BUYER';

  const [role, setRole] = useState(defaultRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Custom Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setToast({ show: false, message: '', type: '' });

    const payload = {
        fullName,
        email,
        password,
        role,
        ...(role === 'SELLER' && { storeName, phone, bio })
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        showToast(data.message, 'success');
        
        // Role-based redirection after registration
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
      console.error('Registration network error:', error);
      showToast('خطا در اتصال به سرور. مطمئن شوید بک‌اند روشن است.', 'error');
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

      <div className="w-full max-w-sm p-5 py-12 z-10">
        <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">ایجاد حساب کاربری</h2>
        <p className="text-gray-400 mb-6 text-xs font-medium">لطفا نوع حساب خود را انتخاب کنید</p>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => setRole('BUYER')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'BUYER' ? 'bg-white text-[#6320ee] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            خریدار هستم
          </button>
          <button
            type="button"
            onClick={() => setRole('SELLER')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'SELLER' ? 'bg-white text-[#6320ee] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            فروشنده هستم
          </button>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">نام و نام خانوادگی کامل</label>
            <input 
              type="text" 
              placeholder="مثال: رضا سلطانی"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">ادرس ایمیل</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">رمز عبور امنیتی</label>
            <input 
              type="password" 
              placeholder="حداقل 8 کاراکتر ترکیبی"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
              required 
            />
          </div>

          {role === 'SELLER' && (
            <div className="space-y-4 pt-4 border-t border-gray-100 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-black text-[#6d28d9] mb-2">اطلاعات تکمیلی فروشگاه</p>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">نام فروشگاه یا برند</label>
                <input 
                  type="text" 
                  placeholder="مثال: اکادمی برنامه نویسی"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
                  required={role === 'SELLER'} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">شماره تماس (اختیاری)</label>
                <input 
                  type="text" 
                  placeholder="09120000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">توضیحات کوتاه فروشنده</label>
                <textarea 
                  placeholder="درباره تخصص و محصولات خود بنویسید..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-xs font-semibold h-24 resize-none"
                ></textarea>
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-3.5 bg-[#6320ee] hover:bg-[#4b14b8] text-white font-black rounded-xl transition-all text-xs shadow-lg shadow-purple-100 cursor-pointer mt-6">
            تایید و ایجاد حساب کاربری ←
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 font-medium mb-10">
          قبلا در پلتفرم ثبت نام کرده اید؟{' '}
          <Link to="/login" className="text-[#6320ee] hover:underline font-black">
            ورود به حساب
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}