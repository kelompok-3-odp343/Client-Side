import React, { useEffect, useState, useRef } from "react";
import "../styles/profile.css";
import Navbar from "../../../shared/components/Navbar";
import { getUserProfile } from "../api/profileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNewPassModal, setShowNewPassModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getUserProfile();
      setProfile(res.data.profile);
      setLoading(false);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    let t;
    if (resendTimer > 0) t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;

  const fullName = [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ");
  const formattedDOB = new Date(profile.dob).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const openOtpModal = () => {
    setOtp(["", "", "", "", "", ""]);
    setErrorMsg("");
    setShowOtpModal(true);
  };

  const handleOtpChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1].focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1].focus();
  };

  const verifyOtp = () => {
    if (otp.join("").length === 6) {
      setShowOtpModal(false);
      setShowNewPassModal(true);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(60);
  };

  const rules = {
    length: newPass.length >= 8,
    upperLower: /[a-z]/.test(newPass) && /[A-Z]/.test(newPass),
    number: /\d/.test(newPass),
    special: /[!@#$%^&*]/.test(newPass),
  };
  const allValid = Object.values(rules).every(Boolean);

  const savePassword = () => {
    setErrorMsg("");
    if (newPass !== confirmPass) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!allValid) {
      setErrorMsg("Password does not meet all requirements");
      return;
    }
    setShowNewPassModal(false);
    setShowSuccessModal(true);
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-wrapper">
        <section className="profile-left">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="user-name">{fullName}</h2>
          <div className="cif-card">
            <i className="fas fa-id-card"></i>
            <div>
              <p className="label">CIF</p>
              <p className="value">{profile.cif}</p>
            </div>
          </div>
        </section>

        <section className="profile-right">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-box">
              <i className="fas fa-user"></i>
              <div>
                <p className="label">Name</p>
                <p className="value">{fullName}</p>
              </div>
            </div>
            <div className="info-box">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <p className="label">Date of Birth</p>
                <p className="value">{formattedDOB}</p>
              </div>
            </div>
            <div className="info-box">
              <i className="fas fa-envelope"></i>
              <div>
                <p className="label">Email Address</p>
                <p className="value">{profile.email_address}</p>
              </div>
            </div>
            <div className="info-box">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">{profile.phone_number}</p>
              </div>
            </div>
          </div>

          <div className="bottom-buttons">
            <button className="update-pass-btn" onClick={openOtpModal}>
              Update Password
            </button>
            <button className="signout-btn" onClick={() => (window.location.href = "/")}>
              Sign Out
            </button>
          </div>
        </section>
      </main>

      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowOtpModal(false)}>
              ×
            </button>
            <h2>Verify your OTP</h2>
            <p>Please enter the 6-digit code sent to your email.</p>
            <div className="otp-inputs">
              {otp.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={val}
                  ref={(el) => (otpRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKey(e, i)}
                />
              ))}
            </div>
            <button
              className="primary-btn"
              onClick={verifyOtp}
              disabled={!/^\d{6}$/.test(otp.join(""))}
            >
              Verify OTP
            </button>
            <p className="resend-text">
              {resendTimer > 0 ? (
                <span>Resend available in {resendTimer}s</span>
              ) : (
                <>
                  Didn’t receive the email?{" "}
                  <button className="resend-btn" onClick={resendOtp}>
                    Click to resend
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {showNewPassModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowNewPassModal(false)}>
              ×
            </button>
            <h2>Create a New Password</h2>
            <ul className="rules-list">
              <li className={rules.length ? "valid" : "invalid"}>Minimum 8 characters</li>
              <li className={rules.upperLower ? "valid" : "invalid"}>
                One uppercase & one lowercase letter
              </li>
              <li className={rules.number ? "valid" : "invalid"}>At least one number</li>
              <li className={rules.special ? "valid" : "invalid"}>
                At least one special character (!@#$%^&*)
              </li>
            </ul>
            <div className="password-field">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                <i className={`fas ${showNewPass ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <div className="password-field">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                <i className={`fas ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errorMsg && <p className="error-text">{errorMsg}</p>}
            <button className="primary-btn" onClick={savePassword}>
              Save
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-card success">
            <i className="fas fa-check-circle"></i>
            <h3>Your password was updated successfully</h3>
            <button className="primary-btn" onClick={() => setShowSuccessModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}