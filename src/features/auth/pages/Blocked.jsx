import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-blocked.css";
import logo from "../../../assets/images/wandoor-logo-2.png";

export default function PopupBlock() {
  const navigate = useNavigate();

  return (
    <div className="auth-background">
      <div className="block-box fade-in">
        <div className="logo">
          <img src={logo} alt="Wandoor Logo" className="logo-img" />
        </div>

        <div className="block-icon">
          <i className="fas fa-ban"></i>
        </div>

        <h2>Account Temporarily Blocked</h2>
        <p>
          You have entered incorrect codes too many times.
          <br />
          Please try again later or contact support for assistance.
        </p>

        <button className="block-btn" onClick={() => navigate("/")}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}