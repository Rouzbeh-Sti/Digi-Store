import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage(data.message);
        setFullName('');
        setEmail('');
        setPassword('');
      } else {
        // Display the exact Persian error message sent by backend
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Registration network error:', error);
      setErrorMessage('خطا در اتصال به سرور. مطمئن شوید بک‌اَند روشن است.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm p-5" style={{ direction: 'rtl' }}>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">ایجاد حساب رایگان</h2>
        <p className="text-gray-500 mb-6 text-sm">همین امروز شروع کنید - بدون کارت بانکی</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
            <input 
              type="text" 
              placeholder="احمد کریمی"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-all text-sm"
              required 
            />
          </div>

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

          <button type="submit" className="w-full py-3 bg-[#6320ee] hover:bg-[#4b14b8] text-white font-bold rounded-lg transition-colors text-sm shadow-md shadow-purple-200">
            ایجاد حساب ←
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          حساب دارید؟{' '}
          <Link to="/login" className="text-[#6320ee] hover:underline font-bold">
            ورود
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}