import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFullName(storedUser.fullName || '');
      setStoreName(storedUser.storeName || '');
      setPhone(storedUser.phone || '');
      setBio(storedUser.bio || '');
    }
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3500);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName, storeName, phone, bio })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user)); // Update local storage
        setUser(data.user);
        showToast(data.message, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('خطا در ارتباط با سرور', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('خطا در ارتباط با سرور', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />

      {/* Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-3 rounded-xl shadow-2xl transition-all duration-500 ease-out flex items-center gap-3 text-xs font-black ${
        toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
        <span className="text-base">{toast.type === 'success' ? '✅' : '⚠️'}</span>
        {toast.message}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center sm:text-right">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">تنظیمات حساب کاربری</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">مدیریت اطلاعات فردی، فروشگاه و امنیت اکانت شما</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${activeTab === 'profile' ? 'bg-[#6320ee] text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-500 hover:bg-purple-50 hover:text-[#6d28d9]'}`}
            >
              <span>👤</span> اطلاعات کاربری
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${activeTab === 'password' ? 'bg-[#6320ee] text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-500 hover:bg-purple-50 hover:text-[#6d28d9]'}`}
            >
              <span>🔒</span> امنیت و رمز عبور
            </button>
          </div>

          {/* Form Content Area */}
          <div className="w-full md:w-3/4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden">
            
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg font-black text-gray-900 mb-6">ویرایش مشخصات پایه</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">نام و نام خانوادگی</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold" required />
                  </div>
                  
                  {user.role === 'SELLER' && (
                    <div className="space-y-5 pt-4 border-t border-gray-50">
                      <h3 className="text-xs font-black text-[#6d28d9]">اطلاعات عمومی فروشگاه</h3>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">نام برند / فروشگاه</label>
                        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">شماره تماس (اختیاری)</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold text-left" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">درباره شما (Bio)</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold h-24 resize-none" />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="px-8 py-3.5 bg-[#6320ee] hover:bg-[#521ac4] text-white font-black rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50 active:scale-95">
                      {isLoading ? 'در حال ثبت...' : 'ذخیره تغییرات پروفایل'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg font-black text-gray-900 mb-6">تغییر رمز عبور</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">رمز عبور فعلی</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">رمز عبور جدید</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="حداقل ۸ کاراکتر وارد کنید" className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#6320ee] transition-colors text-xs font-semibold" required />
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-black rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50 active:scale-95">
                      {isLoading ? 'در حال تغییر...' : 'بروزرسانی رمز عبور'}
                    </button>
                  </div>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}