import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // Retrieve authentication context from local storage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Redirect unauthenticated users immediately to login page
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // Block access if user role is not authorized for this specific route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or route to a dedicated 403 Forbidden page
  }

  // Render the requested component if all security checks pass
  return children;
}