import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import our modular page components based on clean architecture
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    // BrowserRouter hooks into the browser's History API to monitor URL changes
    <BrowserRouter>
      
      {/* Routes evaluates the current URL against all defined Route children */}
      <Routes>
        
        {/* Default route: Redirects users from "/" to "/login" automatically */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route configuration for User Authentication (Login) */}
        <Route path="/login" element={<Login />} />
        
        {/* Route configuration for User Registration (Sign Up) */}
        <Route path="/register" element={<Register />} />
        
        {/* Fallback 404 Route for any undefined paths entered by the user */}
        <Route path="*" element={
          <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-800">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-gray-500">صفحه مورد نظر یافت نشد!</p>
          </div>
        } />
        
      </Routes>
      
    </BrowserRouter>
  );
}