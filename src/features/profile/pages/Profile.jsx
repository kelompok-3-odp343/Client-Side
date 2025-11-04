import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Navbar from "../../../shared/components/Navbar";
import { getUserProfile } from "../api/profileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOtpConfirm, setShowOtpConfirm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  // ===== Timer logic =====
  useEffect(() => {
    if (!timerActive || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, resendTimer]);

  if (loading) return <div style={{ textAlign: "center" }}>Loading profile...</div>;

  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  const formattedDOB = new Date(profile.dob).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ===== Modal Handlers =====
  const handleSendOtp = () => {
    setShowOtpConfirm(false);
    setShowOtpModal(true);
    setOtp(Array(6).fill(""));
    setResendTimer(60);
    setTimerActive(true);
  };

  const handleCloseOtp = () => {
    setShowOtpModal(false);
    setOtp(Array(6).fill(""));
    setTimerActive(false);
    setResendTimer(0);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(Array(6).fill(""));
    setResendTimer(60);
    setTimerActive(true);
  };

  const handleVerifyOtp = () => {
    setShowOtpModal(false);
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError("");
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Password does not match");
      return;
    }
    const rulesMet =
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[!@#$%^&*]/.test(newPassword);

    if (!rulesMet) {
      setPasswordError("Password does not meet all requirements");
      return;
    }

    setShowPasswordModal(false);
    setShowSuccessModal(true);
  };

  const passwordValidation = {
    length: newPassword.length >= 8,
    case: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*]/.test(newPassword),
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
                <p className="value">{profile.emailAddress}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">{profile.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="bottom-buttons flex justify-end">
            {/* <button className="update-pass-btn" onClick={() => setShowOtpConfirm(true)}>
              Update Password
            </button> */}
            <button className="signout-btn" onClick={() => setShowLogoutConfirm(true)}>
              Sign Out
            </button>
          </div>
        </section>
      </main>

      {/* ========== Modal: Confirm Send OTP ========== */}
      {showOtpConfirm && (
        <div className="modal-overlay">
          <div className="modal-card confirm-otp">
            <button className="modal-close" onClick={() => setShowOtpConfirm(false)}>×</button>
            <h2>Send Verification Code</h2>
            <p className="otp-info-text">
              To update your password securely, please verify your identity first.<br />
              We will send a 6-digit verification code to your registered email:
            </p>
            <p className="otp-email">{profile.email_address}</p>
            <div className="confirm-actions">
              <button className="primary-btn" onClick={handleSendOtp}>Send OTP</button>
              <button className="cancel-btn" onClick={() => setShowOtpConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Modal: OTP Verification ========== */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-card otp-verification">
            <button className="modal-close" onClick={handleCloseOtp}>×</button>
            <h2>Enter Verification Code</h2>
            <p className="otp-desc">We’ve sent a 6-digit code to your email</p>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              className="verify-btn"
              onClick={handleVerifyOtp}
              disabled={otp.some((d) => d === "")}
            >
              Verify OTP
            </button>

            <div className="resend-wrapper">
              <p>Didn’t get the code? {resendTimer > 0 ? `${resendTimer}s` : ""}</p>
              <button
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? "" : "Click to resend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Modal: New Password ========== */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card password-modal">
            <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            <h2>Create a New Password</h2>

            <ul className="rules-list">
              <li className={passwordValidation.length ? "valid" : "invalid"}>Minimum 8 characters</li>
              <li className={passwordValidation.case ? "valid" : "invalid"}>One uppercase & one lowercase letter</li>
              <li className={passwordValidation.number ? "valid" : "invalid"}>At least one number</li>
              <li className={passwordValidation.special ? "valid" : "invalid"}>At least one special character (!@#$%^&*)</li>
            </ul>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {passwordError && <p className="error-text">{passwordError}</p>}

            <button className="save-btn" onClick={handleSavePassword}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* ========== Modal: Password Success ========== */}
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

      {/* ========== Modal: Sign Out Confirmation ========== */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-card logout-confirm">
            <button className="modal-close" onClick={() => setShowLogoutConfirm(false)}>×</button>
            <h2>Confirm Sign Out</h2>
            <p>Are you sure you want to sign out from your account?</p>
            <div className="confirm-actions">
              <button className="primary-btn" onClick={() => (window.location.href = "/")}>
                Yes, Sign Out
              </button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}