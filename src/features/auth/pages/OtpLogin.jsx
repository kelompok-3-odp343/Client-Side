import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-otp.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import { postVerifyOtp, postResendOtp } from "../api/authService";
import { decodeJwtToken } from "../api/jwtHelper";

export default function OtpLogin() {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const inputsRef = useRef([]);
	const navigate = useNavigate();

	const handleChange = (e, i) => {
		const value = e.target.value.replace(/\D/g, "");
		if (value.length > 1) return;
		const newOtp = [...otp];
		newOtp[i] = value;
		setOtp(newOtp);
		if (value && i < 5) inputsRef.current[i + 1].focus();
	};

	const handleVerify = async () => {
		const otp_code = otp.join("");
		if (otp_code.length !== 6) {
			setMessage("Enter 6-digit OTP");
			setShowModal(true);
			return;
		}

		const sessionID = sessionStorage.getItem("sessionID");
		if (!sessionID) {
			setMessage("Session expired. Please log in again.");
			setShowModal(true);
			setTimeout(() => navigate("/"), 2000);
			return;
		}

		setLoading(true);
		const resp = await postVerifyOtp({ sessionID, otp_code });
		setLoading(false);

		if (!resp.ok || !resp.data?.status) {
			setMessage(resp.message || "Invalid OTP");
			setShowModal(true);
			setOtp(["", "", "", "", "", ""]);
			inputsRef.current[0].focus();
			return;
		}

		sessionStorage.setItem("token", resp.data.token);
		const userData = decodeJwtToken(resp.data.token);
		if (userData) {
			sessionStorage.setItem("user_id", userData.userId);
			sessionStorage.setItem("username", userData.username);
			sessionStorage.setItem("role", userData.role);
			sessionStorage.setItem("cif", userData.cif);
		}
		sessionStorage.setItem("attempt", resp.data.attemptCount);

		setMessage("✅ OTP Verified (DEV MODE)");
		setShowModal(true);

		setTimeout(() => {
			setShowModal(false);
			navigate("/dashboard");
		}, 800);
	};

	const handleResend = async () => {
		const sessionID = sessionStorage.getItem("sessionID");
		if (!sessionID) {
			setMessage("Session expired. Please log in again.");
			setShowModal(true);
			setTimeout(() => navigate("/"), 2000);
			return;
		}

		if (resendTimer > 0) return;

		const resp = await postResendOtp({ sessionID });

		if (!resp.ok) {
			setMessage(resp.message);
			setShowModal(true);
			return;
		}

		const cooldown = resp.data?.resendCooldown ?? 30;
		setResendTimer(cooldown);

		const interval = setInterval(() => {
			setResendTimer((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		setMessage(resp.data.message || "Kode OTP baru telah dikirim.");
		setShowModal(true);
	};

	return (
		<div className="auth-background">
			<div className="otp-box fade-in">
				<div className="logo">
					<img src={logo} alt="Wandoor Logo" className="logo-img" />
				</div>

				<h2 className="otp-title">Verify Your OTP</h2>
				<p className="otp-subtitle">Enter the 6-digit code sent to your email.</p>

				<div className="otp-inputs">
					{otp.map((digit, i) => (
						<input
							key={i}
							type="text"
							maxLength="1"
							value={digit}
							ref={(el) => (inputsRef.current[i] = el)}
							onChange={(e) => handleChange(e, i)}
						/>
					))}
				</div>

				<button
					type="button"
					className="otp-btn"
					onClick={handleVerify}
					disabled={loading}
				>
					{loading ? "Verifying..." : "Verify OTP"}
				</button>

				<p className="otp-resend">
					Didn’t get code?{" "}
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
						<h3 className="modal-title">OTP Verification</h3>
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