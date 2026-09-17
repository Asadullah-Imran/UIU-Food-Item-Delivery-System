import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect cleanly to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasPermission = () => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (allowedRoles.includes(user.role)) return true;
    // Allow student who is also a runner to access runner routes
    if (allowedRoles.includes('runner') && (user.isRunner || user.role === 'student')) return true;
    // Allow runner to access student shopping routes
    if (allowedRoles.includes('student') && (user.role === 'runner' || user.isRunner)) return true;
    return false;
  };

  if (!hasPermission()) {
    // Redirect if active session has different role
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
}
