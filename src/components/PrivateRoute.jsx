import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return React.createElement('div', { className: "flex justify-center items-center h-screen" }, 'Loading...');
  }

  return user ? React.createElement(Outlet) : React.createElement(Navigate, { to: "/login" });
};

export default PrivateRoute;