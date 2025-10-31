import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (!token) return <Navigate to="/" replace />;

  // role-based protection
  if (location.pathname.startsWith("/admin") && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (!location.pathname.startsWith("/admin") && role === "admin") {
    return <Navigate to="/admin/home" replace />;
  }

  return <Outlet />;
}