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

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
        
        setSuccessMessage(data.message);
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Registration network error:', error);
      setErrorMessage('خطا در اتصال به سرور. مطمئن شوید بک اند روشن است.');
    }
  };

  return (
    <AuthLayout>
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

        {successMessage && (
          <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

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
            <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
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