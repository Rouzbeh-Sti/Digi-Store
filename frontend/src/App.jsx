import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import our modular components and pages based on clean architecture
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    // BrowserRouter interacts with the browser's History API to manage navigation
    <BrowserRouter>
      
      {/* Routes container evaluates the URL path sequentially */}
      <Routes>
        
        {/* Main landing page of the marketplace */}
        <Route path="/" element={<Home />} />
        
        {/* User Authentication - Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* User Authentication - Registration Route */}
        <Route path="/register" element={<Register />} />
        
        {/* Fallback 404 Page for any undefined URL paths */}
        <Route path="*" element={
          <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8f8fc] text-[#0f0e1a]">
            <h1 className="text-5xl font-black mb-2 text-[#6d28d9]">۴۰۴</h1>
            <p className="text-gray-500 font-medium text-sm">صفحه مورد نظر در بازارچه یافت نشد!</p>
          </div>
        } />
        
      </Routes>
      
    </BrowserRouter>
  );
}