import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute: mencegah akses ke halaman tertentu jika user belum login.
 */
export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("userEmail"); 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}