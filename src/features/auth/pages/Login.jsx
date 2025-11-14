import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-login.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import { postAuthLogin } from "../api/authService";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("error");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!username.trim() || !password.trim()) {
			setMessage("Please fill in both fields");
			setModalType("error");
			setShowModal(true);
			return;
		}

		setLoading(true);
		setMessage("");

		const respLogin = await postAuthLogin({ username, password });
		setLoading(false);

		if (!respLogin.ok || !respLogin.data?.status) {
			setMessage(respLogin.message || "Invalid Username or Password");
			setModalType("error");
			setShowModal(true);
			return;
		}

		const { role, sessionIdOrToken, token, message: apiMsg } = respLogin.data;

		sessionStorage.setItem("sessionID", sessionIdOrToken || "NO_SESSION");
		sessionStorage.setItem("token", token || "DUMMY_TOKEN");
		sessionStorage.setItem("role", role || "user");

		setMessage(apiMsg || "Login success");
		setModalType("success");
		setShowModal(true);

		setTimeout(() => {
			setShowModal(false);
			if (role === "admin") {
				navigate("/admin/home");
			} else {
				navigate("/otpLogin");
			}
		}, 800);
	};

	const handleForgotPassword = (e) => {
		e.preventDefault();
		navigate("/forgot");
	};

	return (
		<div className="auth-background">
			<div className="login-box fade-in">
				<div className="logo">
					<img src={logo} alt="Wandoor Logo" className="logo-img" />
				</div>

				<p className="login-subtitle">Please login to your account</p>

				<form onSubmit={handleSubmit}>
					<div className="input-field">
						<i className="fas fa-user"></i>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="input-field">
						<i className="fas fa-lock"></i>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<i
							className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-eye`}
							onClick={() => setShowPassword(!showPassword)}
						></i>
					</div>

					<div className="forgot-password">
						<a href="#" onClick={handleForgotPassword}>
							Forgot password?
						</a>
					</div>

					<button type="submit" className="login-btn" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>

			{showModal && (
				<div className="modal-overlay">
					<div className={`modal-content ${modalType}`}>
						<h3>{modalType === "success" ? "Login Successful" : "Login Failed"}</h3>
						<p>{message}</p>
						{modalType === "error" && (
							<button onClick={() => setShowModal(false)} className="modal-close-btn">
								Close
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}