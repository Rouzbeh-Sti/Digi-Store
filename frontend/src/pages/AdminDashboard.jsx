import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PendingProducts from '../components/admin/PendingProducts';
import UsersList from '../components/admin/UsersList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const navigate = useNavigate();

  const loadAdminData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    try {
      let endpoint = '';
      if (activeTab === 'pending') endpoint = '/api/admin/pending-products';
      else if (activeTab === 'users') endpoint = '/api/admin/users';
      else if (activeTab === 'transactions') endpoint = '/api/admin/transactions';

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (activeTab === 'pending') setPendingProducts(data);
        else if (activeTab === 'users') setUsers(data);
        else if (activeTab === 'transactions') setTransactions(data);
      }
    } catch (error) {
      console.error("Admin panel loading exception:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleVerify = async (productId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, status })
      });

      if (response.ok) {
        setActionMessage("وضعیت کالا با موفقیت به روز رسانی شد.");
        setTimeout(() => setActionMessage(''), 3000);
        loadAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleBan = async (userId, isBanned) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/user-ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, isBanned })
      });

      if (response.ok) {
        setActionMessage("محدودیت حساب کاربر با موفقیت تغییر کرد.");
        setTimeout(() => setActionMessage(''), 3000);
        loadAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (userId, role) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/user-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, role })
      });

      if (response.ok) {
        setActionMessage("نقش امنیتی کاربر با موفقیت ویرایش شد.");
        setTimeout(() => setActionMessage(''), 3000);
        loadAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">پنل مدیریت سیستم</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">نظارت کلی بر محصولات تعلیق شده، تراکنش‌های مالی و کاربران</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          <button onClick={() => setActiveTab('pending')} className={`px-5 py-3 text-xs font-black rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'pending' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
            📦 مدیریت محصولات ({pendingProducts.length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-5 py-3 text-xs font-black rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'users' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
            👥 مدیریت سطوح کاربران
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`px-5 py-3 text-xs font-black rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'transactions' ? 'border-[#6320ee] text-[#6320ee] bg-purple-50/40' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
            📊 گزارش تراکنش‌ها
          </button>
        </div>

        {actionMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-black rounded-xl">
            ✓ {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 min-h-[300px]">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 font-bold text-sm">در حال دریافت داده‌های امنیتی مدیریت...</div>
          ) : (
            <div>
              {activeTab === 'pending' && <PendingProducts products={pendingProducts} onVerify={handleVerify} />}
              {activeTab === 'users' && <UsersList users={users} onToggleBan={handleToggleBan} onRoleChange={handleRoleChange} />}
              {activeTab === 'transactions' && (
                <div className="overflow-x-auto">
                  {transactions.length > 0 ? (
                    <table className="w-full text-right border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="p-4 text-xs font-black text-gray-400">شناسه خرید</th>
                          <th className="p-4 text-xs font-black text-gray-400">پرداخت‌کننده</th>
                          <th className="p-4 text-xs font-black text-gray-400">مبلغ تراکنش</th>
                          <th className="p-4 text-xs font-black text-gray-400">درگاه / متد</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/40">
                            <td className="p-4 text-xs font-bold text-gray-400">#{t.id}</td>
                            <td className="p-4 text-xs font-black text-gray-900">{t.order?.buyer?.fullName || 'کاربر سیستم'}</td>
                            <td className="p-4 text-xs font-black text-green-600">{t.amount.toLocaleString('en-US')} تومان</td>
                            <td className="p-4 text-xs font-bold text-gray-500">{t.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-10 text-gray-400 font-bold text-sm">تراکنشی یافت نشد.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}