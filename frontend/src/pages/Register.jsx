import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
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
      setErrorMessage('خطا در اتصال به سرور. مطمئن شوید بک‌اَند روشن است.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm p-5">
        <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">ایجاد حساب رایگان</h2>
        <p className="text-gray-400 mb-8 text-xs font-medium">همین امروز کسب‌وکار دیجیتال خود را شروع کنید</p>

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
            <label className="block text-xs font-bold text-gray-700 mb-2">نام و نام خانوادگی كامل</label>
            <input 
              type="text" 
              placeholder="به عنوان مثال: رضا سلطانی"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] focus:ring-2 focus:ring-purple-50 transition-all text-xs font-semibold"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">آدرس ایمیل</label>
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
            <label className="block text-xs font-bold text-gray-700 mb-2">رمز عبور امنیتی</label>
            <input 
              type="password" 
              placeholder="حداقل ۸ کاراکتر ترکیبی"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#6320ee] focus:ring-2 focus:ring-purple-50 transition-all text-xs font-semibold"
              required 
            />
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#6320ee] hover:bg-[#4b14b8] text-white font-black rounded-xl transition-all text-xs shadow-lg shadow-purple-100 cursor-pointer mt-2">
            تأیید و ایجاد حساب کاربری ←
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          قبلاً در پلتفرم ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="text-[#6320ee] hover:underline font-black">
            ورود به حساب
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}