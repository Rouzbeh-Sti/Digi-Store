import React, { useState, useEffect } from 'react';
import SharedCustomTable from '../SharedCustomTable';

export default function AdminSubscriptionManagement() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/subscription-plans`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setPlans(await res.json());
    }
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/subscription-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ price: newPrice, isActive: true }) // let say it's always active for now, we can add a toggle later
    });
    
    if (res.ok) {
      setEditingPlan(null);
      fetchPlans();
    }
  };

  const headers = ["عنوان پلن", "مدت زمان", "قیمت فعلی (تومان)", "عملیات"];

  const renderRowCells = (plan) => [
    <span className="text-xs font-black text-gray-900">{plan.title}</span>,
    <span className="text-xs font-bold text-gray-500">{plan.duration}</span>,
    editingPlan === plan.id ? (
      <input 
        type="number" 
        value={newPrice} 
        onChange={(e) => setNewPrice(e.target.value)} 
        className="p-1 border border-purple-200 rounded text-xs w-24 text-center"
      />
    ) : (
      <span className="text-xs font-black text-purple-600">{plan.price.toLocaleString()}</span>
    ),
    <div className="flex gap-2 justify-center">
      {editingPlan === plan.id ? (
        <button onClick={() => handleUpdate(plan.id)} className="px-3 py-1 bg-green-50 text-green-600 font-bold text-[10px] rounded-lg border border-green-100">ذخیره</button>
      ) : (
        <button onClick={() => { setEditingPlan(plan.id); setNewPrice(plan.price); }} className="px-3 py-1 bg-purple-50 text-purple-600 font-bold text-[10px] rounded-lg border border-purple-100">تغییر قیمت</button>
      )}
    </div>
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-gray-800">مدیریت پلن‌های دیجی‌کورس</h2>
      <SharedCustomTable headers={headers} rows={plans} renderRowCells={renderRowCells} />
    </div>
  );
}