import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import CardSection from "./pages/CardSection";
import InputEmail from "./pages/otpLogin";
import DetailFitur from "./pages/DetailFitur";
import PopupBlock from "./pages/PopupBlock";

export default function App () {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cardSection" element={<CardSection />} />
      <Route path="/otpLogin" element={<InputEmail />} />
      <Route path="/detailfitur" element={<DetailFitur />} />
      <Route path="/popupblock" element={<PopupBlock />} />
    </Routes>
  );
}
