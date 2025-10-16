import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./features/auth/pages/Login";
import OtpLogin from "./features/auth/pages/OtpLogin";
import PopupBlock from "./features/auth/pages/Blocked";
import Dashboard from "./features/dashboard/pages/Dashboard";
import LifeGoals from "./features/life-goals//pages/LifeGoals";
import LifeGoalDetail from "./features/life-goals/pages/LifeGoalsDetail";
import DepositsDashboard from "./features/deposit/pages/Deposit";
import Profile from "./features/profile/pages/Profile";
import CardSection from "./features/card/pages/CardSection";
import DetailMyCard from "./features/card/pages/DetailMyCard";
import SavingsDashboard from "./features/saving/pages/Saving";
import PensionFunds from "./features/pension-funds/pages/PensionFunds";
import SplitBill from "./features/split-bill/pages/SplitBill.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lifegoals" element={<LifeGoals />} />
        <Route path="/lifegoal/:id" element={<LifeGoalDetail />} />
        <Route path="/deposits" element={<DepositsDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/otpLogin" element={<OtpLogin />} />
        <Route path="/popupblock" element={<PopupBlock />} />
        <Route path="/mycard" element={<CardSection />} />
        <Route path="/detailmycard" element={<DetailMyCard />} />
        <Route path="/savings" element={<SavingsDashboard />} />
        <Route path="/pensionfunds" element={<PensionFunds />} />
        <Route path="/splitbill" element={<SplitBill />} />
      </Routes>
    </AnimatePresence>
  );
}