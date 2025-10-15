import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute: block access if user not authenticated
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user || token === "null" || token === "undefined") {
    return <Navigate to="/" replace />;
  }

  return children;
}