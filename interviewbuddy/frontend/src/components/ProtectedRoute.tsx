import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";
const ProtectedRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState label="Checking your session..." />;
  if (!user) {
    return (
      <Navigate
        to={adminOnly ? "/admin/login" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }
  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  if (!adminOnly && user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
