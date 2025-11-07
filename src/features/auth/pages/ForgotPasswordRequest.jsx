import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth-forgot.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import Swal from "sweetalert2";
import { postForgotPasswordRequestOtp } from "../api/authService";

export default function ForgotPasswordRequest() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await postForgotPasswordRequestOtp({ username });

            if (res.ok && res.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent!",
                    text: res.data.message,
                    confirmButtonColor: "#00bfa6",
                }).then(() => {
                    sessionStorage.setItem("fp_session", res.data.sessionId);
                    navigate("/forgot/otp", { state: { username, sessionId: res.data.sessionId } });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: res.message || "Gagal mengirim OTP",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Terjadi kesalahan server",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    return (
        <div className="auth-background">
            <div className="forgot-box fade-in">
                <img src={logo} alt="Wandoor Logo" className="logo-img" />
                <p className="login-subtitle">We will send OTP to your registered email</p>

                <form onSubmit={handleSendOtp}>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <div className="back-to-login">
                    <a href="#" onClick={handleBackToLogin}>
                        ← Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}
