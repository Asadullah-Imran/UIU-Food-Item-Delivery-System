import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show a popup message if the user is denied access
    if (!isLoading) {
      if (!user) {
        alert("Access Denied: Please login first.");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        alert("Access Denied: You do not have permission to view this page.");
      }
    }
  }, [user, isLoading, allowedRoles]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">Loading...</div>; // Could be a beautiful spinner
  }

  if (!user) {
    // Redirect to login if not authenticated, storing the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect if they have an active session but wrong role
    // E.g., redirect to their correct dashboard
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
}
