import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-otp.css";

export default function OtpLogin() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code === "123456") {
      setMessage("✅ OTP Verified!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setMessage("🚫 Too many failed attempts. Redirecting...");
        setTimeout(() => navigate("/popupblock"), 1500);
      } else {
        setMessage(`❌ Invalid OTP. Attempt ${newAttempts}/3.`);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0].focus();
        setTimeout(() => setMessage(""), 2500);
      }
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="auth-background">
      <div className="otp-box fade-in">
        <div className="logo">
          <i className="fas fa-door-open"></i>
          <h1>
            wand<span className="o1">o</span>
            <span className="o2">o</span>r
          </h1>
        </div>

        <h2 className="otp-title">Verify Your OTP</h2>
        <p className="otp-subtitle">
          Enter the 6-digit code sent to your registered email.
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>

        <button className="otp-btn" onClick={handleVerify}>
          Verify OTP
        </button>

        {message && <p className="otp-message">{message}</p>}

        <p className="otp-resend">
          Didn’t receive the email?{" "}
          <span
            className={`otp-resend-link ${
              resendTimer > 0 ? "disabled" : ""
            }`}
            onClick={handleResend}
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : "Click to resend"}
          </span>
        </p>

        <div className="otp-back" onClick={() => navigate("/")}>
          ← Back to Sign In
        </div>
      </div>
    </div>
  );
}