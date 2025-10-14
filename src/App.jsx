import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LifeGoals from "./pages/LifeGoals";
import LifeGoalDetail from "./pages/LifeGoalsDetail";
import DepositsDashboard from "./pages/Deposit";
import Profile from "./pages/Profile";
import OtpLogin from "./pages/OtpLogin";
import PopupBlock from "./pages/PopupBlock";
import CardSection from "./pages/CardSection"
import DetailMyCard from "./pages/detailMyCard";

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
      </Routes>
    </AnimatePresence>
  );
}
