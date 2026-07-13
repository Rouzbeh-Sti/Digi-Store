import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminProductManagement from '../components/admin/AdminProductManagement';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import InspectionModal from '../components/admin/InspectionModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSilentUpdating, setIsSilentUpdating] = useState(false);
  
  const [inspectType, setInspectType] = useState(null);
  const [inspectEntity, setInspectEntity] = useState(null);

  const navigate = useNavigate();

  const loadAdminData = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsSilentUpdating(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/${activeTab === 'pending' ? 'pending-products' : 'users'}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (activeTab === 'pending') setPendingProducts(data);
        else if (activeTab === 'users') setUsers(data);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsSilentUpdating(false);
    }
  };

  useEffect(() => { loadAdminData(false); }, [activeTab]);

  const handleVerify = async (productId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId, status })
    });
    if (response.ok) loadAdminData(true);
  };

  const handleToggleBan = async (userId, isBanned) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/user-ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId, isBanned })
    });
    if (response.ok) loadAdminData(true);
  };

  const handleRoleChange = async (userId, role) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/user-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId, role })
    });
    if (response.ok) loadAdminData(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">🛠️ لایه کنترلی پلتفرم ادمین</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">نظارت کلی و اعمال سطوح دسترسی بر کالاها و اعضای سیستم</p>
          </div>
          {isSilentUpdating && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full border border-purple-100/50 animate-pulse">
              🔄 همگام‌سازی نامحسوس دیتابیس...
            </div>
          )}
        </div>
        
        <div className="flex gap-2 border-b border-gray-200 my-6">
          <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-xs font-black border-b-2 cursor-pointer transition-all duration-200 ${activeTab === 'pending' ? 'border-[#6320ee] text-[#6320ee]' : 'text-gray-400'}`}>📦 مدیریت کالاها و دوره‌ها</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-xs font-black border-b-2 cursor-pointer transition-all duration-200 ${activeTab === 'users' ? 'border-[#6320ee] text-[#6320ee]' : 'text-gray-400'}`}>👥 نظارت کاربری و سطوح دسترسی</button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-xs font-bold text-gray-400">در حال دریافت داده‌های امنیتی مدیریت...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {activeTab === 'pending' && <AdminProductManagement products={pendingProducts} onVerify={handleVerify} onInspect={(p) => { setInspectType('product'); setInspectEntity(p); }} />}
              {activeTab === 'users' && <AdminUserManagement users={users} onToggleBan={handleToggleBan} onRoleChange={handleRoleChange} onInspect={(u) => { setInspectType('user'); setInspectEntity(u); }} />}
            </div>
          )}
        </div>
      </div>

      <InspectionModal isOpen={!!inspectEntity} onClose={() => { setInspectType(null); setInspectEntity(null); }} type={inspectType} entity={inspectEntity} />
    </div>
  );
}