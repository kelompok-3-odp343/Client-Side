import React from "react";
import { useNavigate } from "react-router-dom";
import "./Block.css";

export default function PopupBlock() {
  const navigate = useNavigate();

  return (
    <div className="auth-background">
      <div className="auth-box fade-in">
        <div className="logo">
          <i className="fas fa-door-open"></i>
          <h1>
            wand<span className="o1">o</span>
            <span className="o2">o</span>r
          </h1>
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