import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, clearBlockedUser } from "../../data/auth";
import "./Otp.css";

export default function OtpLogin() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
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

  const handleVerify = async () => {
    const otp_ref = localStorage.getItem("otp_ref");
    const otp_code = otp.join("");

    const res = await verifyOtp({ otp_ref, otp_code });

    if (res.status) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.removeItem("otp_ref"); // penting agar tidak tersisa data lama
      clearBlockedUser();

      setMessage("✅ OTP Verified!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true }); // GUNAKAN replace agar tidak balik ke login
      }, 1000);
    } else if (res.blocked) {
      setMessage(res.message);
      setTimeout(() => navigate("/popupblock", { replace: true }), 1200);
    } else {
      setMessage(res.message);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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