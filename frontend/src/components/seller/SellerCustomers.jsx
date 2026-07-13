import React from 'react';
import SharedCustomTable from '../SharedCustomTable';

export default function SellerCustomers({ customers }) {
  const headers = ["نام کامل دانشجو", "آدرس ایمیل", "محصول خریداری شده"];

  const sortableFields = {
    0: 'fullName',
    1: 'email',
    2: 'productTitle'
  };

  const renderRowCells = (c) => [
    <span className="text-xs font-black text-gray-900">{c.fullName}</span>,
    <span className="text-xs font-bold text-gray-500">{c.email}</span>,
    <span className="text-xs font-bold text-purple-600">{c.productTitle}</span>
  ];

  return <SharedCustomTable headers={headers} rows={customers} renderRowCells={renderRowCells} sortableFields={sortableFields} />;
}