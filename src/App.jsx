import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LifeGoals from "./pages/LifeGoals";
import LifeGoalDetail from "./pages/LifeGoalsDetail";
import Profile from "./pages/Profile";
import OtpLogin from "./pages/OtpLogin";
import PopupBlock from "./pages/PopupBlock";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lifegoals" element={<LifeGoals />} />
        <Route path="/lifegoal/:id" element={<LifeGoalDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/otpLogin" element={<OtpLogin />} />
        <Route path="/popupblock" element={<PopupBlock />} />
      </Routes>
    </AnimatePresence>
  );
}