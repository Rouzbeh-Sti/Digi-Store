import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

// Register component to handle new user account creation
export default function Register() {
  // State variables for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user with:', { fullName, email, password });
    // Future step: Send data to Node.js backend here
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm p-5" style={{ direction: 'rtl' }}>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">ایجاد حساب رایگان</h2>
        <p className="text-gray-500 mb-6 text-sm">همین امروز شروع کنید - بدون کارت بانکی</p>

        <button type="button" className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors mb-5 flex justify-center items-center gap-2">
          <span>ادامه با Google</span>
        </button>

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
              placeholder="حداقل 8 کاراکتر"
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