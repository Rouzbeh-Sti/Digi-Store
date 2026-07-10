import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import SellerDashboard from './pages/SellerDashboard';


export default function App() {
  return (
    // Setup the main router for navigating between different pages
    <BrowserRouter>
      <Routes>
        
        {/* Define the routes for the application */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Marketplace and Product Details routes */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        {/* Fallback route for undefined paths (404 Not Found) */}
        <Route path="*" element={
          <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8f8fc] text-[#0f0e1a]">
            <h1 className="text-5xl font-black mb-2 text-[#6d28d9]">404</h1>
            <p className="text-gray-500 font-medium text-sm">صفحه مورد نظر در بازارچه یافت نشد!</p>
          </div>
        } />

        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}