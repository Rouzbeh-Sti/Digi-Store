import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Standard Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import PaymentResult from './pages/PaymentResult';

// Dashboard & Protected Pages
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import BuyerDashboard from './pages/BuyerDashboard';

// Security Component
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-result" element={<PaymentResult />} />

          {/* Protected Routes */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="/buyer/dashboard" element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          } />

          {/* Strictly Protected Routes (Role-based) */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8f8fc] text-[#0f0e1a]" style={{ direction: 'rtl' }}>
              <h1 className="text-5xl font-black mb-2 text-[#6d28d9]">۴۰۴</h1>
              <p className="text-gray-500 font-medium text-sm">صفحه مورد نظر در بازارچه یافت نشد!</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}