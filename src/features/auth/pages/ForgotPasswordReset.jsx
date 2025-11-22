import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/auth-forgot.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import Swal from "sweetalert2";
import { postForgotPasswordReset } from "../api/authService";

export default function ForgotPasswordReset() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            return Swal.fire({
                icon: "warning",
                title: "Incomplete Fields",
                text: "Please fill both password fields",
            });
        }

        setLoading(true);
        try {
            const res = await postForgotPasswordReset({
                verifiedSession: sessionStorage.getItem('fp_verified'),
                newPassword,
                confirmPassword,
            });

            if (res.ok && res.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "Password Updated",
                    text: res.data.message,
                    confirmButtonColor: "#00bfa6",
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: res.message || "Gagal memperbarui password",
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

    return (
        <div className="auth-background">
            <div className="reset-box fade-in">
                <img src={logo} alt="Wandoor Logo" className="logo-img" />
                <h3>Create A New Password</h3>

                <ul className="password-rules">
                    <li>Min 8 characters</li>
                    <li>At least 1 uppercase and 1 lowercase</li>
                    <li>At least 1 number</li>
                    <li>At least 1 special character (@, $, !, %, *, ?, &)</li>
                </ul>

                <form onSubmit={handleReset}>
                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
}
