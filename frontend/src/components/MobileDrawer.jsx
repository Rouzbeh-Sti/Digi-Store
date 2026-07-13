import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export default function MobileDrawer({ isOpen, onClose, user, isActive }) {
  return createPortal(
    <>
      {/* Smooth Fade Transition Background Layer Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 99998 }}
      />

      {/* Premium Right-Side Slide-In Animated Navigation Drawer */}
      <div 
        className={`fixed top-0 right-0 w-72 bg-white shadow-2xl flex flex-col h-screen transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 99999 }}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <span className="text-lg font-black text-[#6d28d9]">منوی دسترسی</span>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4 text-right flex-1">
          <Link 
            to="/" 
            onClick={onClose}
            className={`flex items-center gap-2 p-4 text-sm font-black rounded-xl transition-all duration-200 ${isActive('/') ? 'bg-purple-50 text-[#6d28d9]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="text-base">🏠</span> صفحه اصلی خانه
          </Link>
          <Link 
            to="/marketplace" 
            onClick={onClose}
            className={`flex items-center gap-2 p-4 text-sm font-black rounded-xl transition-all duration-200 ${isActive('/marketplace') ? 'bg-purple-50 text-[#6d28d9]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span className="text-base">🏪</span> بازارچه محصولات
          </Link>
          {user && user.role === 'SELLER' && (
            <Link 
              to="/seller/dashboard" 
              onClick={onClose}
              className={`flex items-center gap-2 p-4 text-sm font-black rounded-xl transition-all duration-200 ${isActive('/seller/dashboard') ? 'bg-purple-50 text-[#6d28d9]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="text-base">💼</span> پنل فروشندگان
            </Link>
          )}
          {user && user.role === 'ADMIN' && (
            <Link 
              to="/admin/dashboard" 
              onClick={onClose}
              className={`flex items-center gap-2 p-4 text-sm font-black rounded-xl transition-all duration-200 ${isActive('/admin/dashboard') ? 'bg-purple-50 text-[#6d28d9]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="text-base">🛠️</span> پنل مدیریت ادمین
            </Link>
          )}
        </nav>
      </div>
    </>,
    document.body
  );
}