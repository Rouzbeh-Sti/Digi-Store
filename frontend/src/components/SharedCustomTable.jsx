import React, { useState, useMemo } from 'react';

export default function SharedCustomTable({ headers, rows, renderRowCells, sortableFields = {} }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle dynamic sorting logic based on the selected column key
  const handleSort = (headerIndex) => {
    const fieldName = sortableFields[headerIndex];
    if (!fieldName) return;

    let direction = 'asc';
    if (sortConfig.key === fieldName && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: fieldName, direction });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a) ?? '';
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b) ?? '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  return (
    <div className="w-full border border-purple-100/50 bg-white rounded-2xl shadow-xs overflow-hidden max-h-full" style={{ overflowAnchor: 'none' }}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-right border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 select-none">
              {headers.map((header, idx) => {
                const isSortable = !!sortableFields[idx];
                return (
                  <th 
                    key={idx} 
                    onClick={() => isSortable && handleSort(idx)}
                    className={`p-4 text-xs font-black text-gray-400 ${isSortable ? 'cursor-pointer hover:text-purple-600 transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{header}</span>
                      {isSortable && (
                        <span className="text-[10px] opacity-75">
                          {sortConfig.key === sortableFields[idx] ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : '🔹'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="p-12 text-center text-xs font-bold text-gray-400">
                  هیچ داده یا رکوردی در این بخش یافت نشد.
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-purple-50/20 transition-colors duration-150 group">
                  {renderRowCells(row).map((cellContent, cellIdx) => (
                    <td 
                      key={cellIdx} 
                      style={{ animationDelay: `${rowIndex * 35}ms` }}
                      className="p-4 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                    >
                      {cellContent}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}