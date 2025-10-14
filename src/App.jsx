import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css"; // pastikan global style tetap terimport

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AppRoutes key={location.pathname} />
    </AnimatePresence>
  );
}