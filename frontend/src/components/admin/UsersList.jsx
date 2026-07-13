import React from 'react';

export default function UsersList({ users, onToggleBan, onRoleChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="p-4 text-xs font-black text-gray-400">نام کامل</th>
            <th className="p-4 text-xs font-black text-gray-400">آدرس ایمیل</th>
            <th className="p-4 text-xs font-black text-gray-400">نقش دسترسی</th>
            <th className="p-4 text-xs font-black text-gray-400">وضعیت حساب</th>
            <th className="p-4 text-xs font-black text-gray-400">دستورات کنترلی مدیر</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
              <td className="p-4 text-xs font-black text-gray-900">{u.fullName}</td>
              <td className="p-4 text-xs font-bold text-gray-600">{u.email}</td>
              <td className="p-4">
                <select 
                  value={u.role}
                  onChange={(e) => onRoleChange(u.id, e.target.value)}
                  className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-black cursor-pointer text-gray-800"
                >
                  <option value="BUYER">خریدار پلتفرم</option>
                  <option value="SELLER">فروشنده کالا</option>
                  <option value="ADMIN">مدیر سیستم</option>
                </select>
              </td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${u.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {u.isBanned ? 'مسدود شده' : 'فعال و عادی'}
                </span>
              </td>
              <td className="p-4">
                <button 
                  onClick={() => onToggleBan(u.id, !u.isBanned)}
                  className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-colors cursor-pointer ${
                    u.isBanned ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {u.isBanned ? 'رفع مسدودیت حساب' : 'اخراج و مسدودسازی کاربر'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}