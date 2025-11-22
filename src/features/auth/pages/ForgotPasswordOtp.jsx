import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/auth-forgot.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import Swal from "sweetalert2";
import {
    postForgotPasswordVerifyOtp,
    postForgotPasswordRequestOtp,
} from "../api/authService";

export default function ForgotPasswordOtp() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputsRef = useRef([]);

    useEffect(() => {
        let interval;
        if (!canResend && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer <= 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }

        if (!value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6)
            return Swal.fire({
                icon: "warning",
                title: "Invalid OTP",
                text: "OTP harus 6 digit",
            });

        setLoading(true);
        try {
            const res = await postForgotPasswordVerifyOtp({
                sessionId: sessionStorage.getItem('fp_session'),
                otpCode,
            });

            if (res.ok && res.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Verified",
                    text: res.data.message,
                    confirmButtonColor: "#00bfa6",
                }).then(() => {
                    sessionStorage.setItem("fp_verified", res.data.verifiedSession);
                    navigate("/forgot/reset", {
                        state: { verifiedSession: res.data.verifiedSession },
                    });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: res.message || "OTP salah",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Gagal verifikasi OTP",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;

        setResendLoading(true);
        try {
            const res = await postForgotPasswordRequestOtp({ username: state?.username });

            if (res.ok && res.data.status) {
                sessionStorage.setItem("fp_session", res.data.sessionIdOrToken);
                Swal.fire({
                    icon: "success",
                    title: "OTP Resent",
                    text: "Kode OTP baru telah dikirim ke email Anda.",
                    confirmButtonColor: "#00bfa6",
                });
                setTimer(30);
                setCanResend(false);
                setOtp(["", "", "", "", "", ""]);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: res.message || "Gagal mengirim ulang OTP",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Terjadi kesalahan server",
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="otp-box fade-in">
                <img src={logo} alt="Wandoor Logo" className="logo-img" />
                <h3>Verify your OTP</h3>
                <p>Please enter the 6-digit code sent to your registered email.</p>

                <form onSubmit={handleSubmit} className="otp-form">
                    <div className="otp-inputs">
                        {otp.map((val, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                value={val}
                                ref={(el) => (inputsRef.current[i] = el)}
                                onChange={(e) => handleChange(e.target.value, i)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="otp-resend">
                    {!canResend ? (
                        <span className="otp-resend-link disabled">
                            Resend OTP in {timer}s
                        </span>
                    ) : (
                        <span
                            className={`otp-resend-link ${resendLoading ? "disabled" : ""}`}
                            onClick={handleResendOtp}
                        >
                            {resendLoading ? "Resending..." : "Click to resend OTP"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
