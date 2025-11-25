import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthRoute() {
    const token = sessionStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}