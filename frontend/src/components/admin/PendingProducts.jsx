import React from 'react';

export default function PendingProducts({ products, onVerify }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="p-4 text-xs font-black text-gray-400">فروشنده</th>
            <th className="p-4 text-xs font-black text-gray-400">عنوان کالا</th>
            <th className="p-4 text-xs font-black text-gray-400">قیمت</th>
            <th className="p-4 text-xs font-black text-gray-400">وضعیت فعلی</th>
            <th className="p-4 text-xs font-black text-gray-400">اقدام اداری مدیر</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
              <td className="p-4 text-xs font-black text-gray-900">{p.seller?.storeName || p.seller?.fullName}</td>
              <td className="p-4 text-xs font-bold text-gray-900">{p.title}</td>
              <td className="p-4 text-xs font-bold text-purple-600">{p.price.toLocaleString('en-US')} تومان</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                  p.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' :
                  p.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {p.status === 'APPROVED' ? 'منتشر شده' : p.status === 'REJECTED' ? 'مردود شده' : 'در انتظار بررسی'}
                </span>
              </td>
              <td className="p-4 flex gap-1.5">
                {p.status !== 'APPROVED' && (
                  <button onClick={() => onVerify(p.id, 'APPROVED')} className="px-2.5 py-1.5 bg-green-600 text-white text-[11px] font-black rounded-lg hover:bg-green-700 transition-colors cursor-pointer">تایید محصول</button>
                )}
                {p.status !== 'REJECTED' && (
                  <button onClick={() => onVerify(p.id, 'REJECTED')} className="px-2.5 py-1.5 bg-red-100 text-red-600 text-[11px] font-black rounded-lg hover:bg-red-200 transition-colors cursor-pointer">رد/حذف انتشار</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}