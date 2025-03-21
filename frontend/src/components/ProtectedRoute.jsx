
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;