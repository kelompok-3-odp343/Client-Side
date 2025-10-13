import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/blockedStyle.css";

export default function PopupBlock() {
  const navigate = useNavigate();

  return (
    <div className="blocked-container">
      <div className="blocked-card">
        <img
          src="/assets/blocked-icon.png"
          alt="Account Blocked Icon"
          className="blocked-icon"
        />
        <h2 className="blocked-title">Your Account Has Been Blocked</h2>
        <p className="blocked-text">
          For your security, your account has been temporarily blocked.
          <br />
          Please contact our Customer Service to verify your identity and
          restore access to your account.
        </p>
        <div className="blocked-contact">
          <p>📞 Contact CS : 324598011</p>
          <p>✉️ wandoor@darderdor.com</p>
        </div>
        <button className="blocked-button" onClick={() => navigate("/")}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
