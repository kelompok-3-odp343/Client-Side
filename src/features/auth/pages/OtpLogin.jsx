import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-otp.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import { postVerifyOtp } from "../api/authService";

export default function OtpLogin() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
    const otp_code = otp.join("");
    if (otp_code.length !== 6) {
      setMessage("Masukkan 6 digit OTP.");
      setShowModal(true);
      return;
    }

    const sessionID = sessionStorage.getItem("sessionID");
    if (!sessionID) {
      setMessage("OTP session expired. Silahkan Login Kembali.");
      setShowModal(true);
      setTimeout(() => navigate("/"), 2500);
      return;
    }

    const respOTP = await postVerifyOtp({ sessionID, otp_code });

    if (!respOTP.ok) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setMessage("Salah OTP sebanyak 3 kali. Akun diblokir sementara.");
        setShowModal(true);
        setTimeout(() => navigate("/popupblock"), 2500);
      } else {
        setMessage(
          respOTP.message ||
          `Salah OTP. Attempt ${newAttempts}/3`
        );
        setShowModal(true);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0].focus();
      }
      return;
    }

    sessionStorage.setItem("token", respOTP.data.token);
    sessionStorage.setItem("user_id", respOTP.data.user.userId);
    sessionStorage.setItem("username", respOTP.data.user.username);
    sessionStorage.setItem("role", respOTP.data.user.role);
    sessionStorage.setItem("cif", respOTP.data.user.cif);
    sessionStorage.setItem("attempt", respOTP.data.attemptCount);

    setMessage("✅ OTP Verified!");
    setTimeout(() => navigate("/dashboard"), 800);
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
          <img src={logo} alt="Wandoor Logo" className="logo-img" />
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

        <p className="otp-resend">
          Didn’t receive the email?{" "}
          <span
            className={`otp-resend-link ${resendTimer > 0 ? "disabled" : ""}`}
            onClick={handleResend}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Click to resend"}
          </span>
        </p>

        <div className="otp-back" onClick={() => navigate("/")}>
          ← Back to Sign In
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <h3 className="modal-title">⚠️ OTP Verification Failed</h3>
            <p className="modal-message">{message}</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
