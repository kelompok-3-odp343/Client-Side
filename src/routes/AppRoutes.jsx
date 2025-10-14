import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth pages
import Login from "../pages/Auth/Login";
import OtpLogin from "../pages/Auth/Otp";
import PopupBlock from "../pages/Auth/Block";

// Main pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";

// Life Goals
import LifeGoals from "../pages/LifeGoals/LifeGoals";
import LifeGoalDetail from "../pages/LifeGoals/LifeGoalsDetail";

// Deposits, Savings, Pension
import DepositsDashboard from "../pages/Deposit/Deposit";
import Savings from "../pages/Savings/Savings";
import Pension from "../pages/Pension/Pension";

// Cards
import DetailMyCard from "../pages/Card/DetailMyCard";

// Not Found (optional fallback)
const NotFound = () => <h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/otpLogin" element={<OtpLogin />} />
      <Route path="/popupblock" element={<PopupBlock />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lifegoals"
        element={
          <ProtectedRoute>
            <LifeGoals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lifegoal/:id"
        element={
          <ProtectedRoute>
            <LifeGoalDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposits"
        element={
          <ProtectedRoute>
            <DepositsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <Savings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pension"
        element={
          <ProtectedRoute>
            <Pension />
          </ProtectedRoute>
        }
      />
      <Route
        path="/detailmycard"
        element={
          <ProtectedRoute>
            <DetailMyCard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}