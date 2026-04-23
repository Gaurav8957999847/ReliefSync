import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes (the page)
  return <Outlet />;
};

export default ProtectedRoute;
