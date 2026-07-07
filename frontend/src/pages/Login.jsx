import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Sending structured payload to backend...', { email, password });
  };

  return (
    <AuthLayout>
      {/* Form Card Container */}
      <div className="w-full max-w-sm p-5" style={{ direction: 'rtl' }}>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">خوش برگشتید</h2>
        <p className="text-gray-500 mb-6 text-sm">برای ادامه وارد حساب خود شوید</p>

        {/* OAuth Google Button */}
        <button type="button" className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors mb-5 flex justify-center items-center gap-2">
          <span>ادامه با Google</span>
        </button>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-sm"
              required 
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <input 
              type="password" 
              placeholder="حداقل ۸ کاراکتر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-sm"
              required 
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-[#6320ee] hover:bg-[#4b14b8] text-white font-bold rounded-lg transition-colors text-sm shadow-md shadow-purple-200">
            ورود ←
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          حساب ندارید؟{' '}
          <Link to="/register" className="text-[#6320ee] hover:underline font-bold">
            ثبت‌نام رایگان
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}