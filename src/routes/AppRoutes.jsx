import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// === Auth ===
import Login from "../features/auth/pages/Login";
import OtpLogin from "../features/auth/pages/OtpLogin";
import PopupBlock from "../features/auth/pages/Blocked";

// === Nasabah (User) ===
import Dashboard from "../features/dashboard/pages/Dashboard";
import LifeGoals from "../features/life-goals/pages/LifeGoals";
import LifeGoalDetail from "../features/life-goals/pages/LifeGoalsDetail";
import DepositsDashboard from "../features/deposit/pages/Deposit";
import Profile from "../features/profile/pages/Profile";
import CardSection from "../features/card/pages/CardSection";
import DetailMyCard from "../features/card/pages/DetailMyCard";
import SavingsDashboard from "../features/saving/pages/Saving";
import PensionFunds from "../features/pension-funds/pages/PensionFunds";
import SplitBill from "../features/split-bill/pages/SplitBill";
import SplitBillDetail from "../features/split-bill/pages/SplitBillDetail";

// === Admin ===
import AdminHome from "../features/admin-dashboard/pages/AdminHome";
import AdminTransactions from "../features/admin-dashboard/pages/AdminTransactions";
import AdminUsers from "../features/admin-dashboard/pages/AdminUsers";
import AdminUserDetail from "../features/admin-dashboard/pages/AdminUserDetail";

// === Routes ===
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ==== Shared Auth Routes ==== */}
        <Route path="/" element={<Login />} />
        <Route path="/otpLogin" element={<OtpLogin />} />
        <Route path="/popupblock" element={<PopupBlock />} />

        {/* ==== Protected Routes (User) ==== */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lifegoals" element={<LifeGoals />} />
          <Route path="/lifegoal/:id" element={<LifeGoalDetail />} />
          <Route path="/deposits" element={<DepositsDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mycard" element={<CardSection />} />
          <Route path="/detailmycard" element={<DetailMyCard />} />
          <Route path="/savings" element={<SavingsDashboard />} />
          <Route path="/pensionfunds" element={<PensionFunds />} />
          <Route path="/splitbill" element={<SplitBill />} />
          <Route path="/splitbill/detail/:id" element={<SplitBillDetail />} />
        </Route>

        {/* ==== Protected Routes (Admin) ==== */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        </Route>

        {/* ==== Fallback ==== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}