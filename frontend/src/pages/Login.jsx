import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
        setSuccessMessage(`خوش آمدید ${data.user.fullName}! ${data.message}`);
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Network failure details:', error);
      setErrorMessage('خطا در اتصال به سرور. مطمئن شوید بک‌اَند روشن است.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm p-5">
        <h2 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">خوش برگشتید</h2>
        <p className="text-gray-400 mb-8 text-xs font-medium">برای ادامه مدیریت دارایی‌ها وارد حساب خود شوید</p>

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