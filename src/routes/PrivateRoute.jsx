import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (!token) return <Navigate to="/" replace />;

  const ADMIN_ROLES = ["ADMIN", "MAKER", "CHECKER", "APPROVER"];

  const isAdminPage = location.pathname.startsWith("/admin");
  const isUserPage = !isAdminPage;

  if (role === "NASABAH") {
    if (isAdminPage) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  if (ADMIN_ROLES.includes(role)) {
    if (isUserPage) {
      return <Navigate to="/admin/home" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}