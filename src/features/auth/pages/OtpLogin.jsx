import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/auth.css";
import "../styles/auth-otp.css";
import logo from "../../../assets/images/wandoor-logo-2.png";
import { postVerifyOtp, postResendOtp } from "../api/authService";
import { decodeJwtToken } from "../api/jwtHelper";

export default function OtpLogin() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    
    // Timer state: inisialisasi 30 agar langsung jalan saat halaman dimuat
    const [resendTimer, setResendTimer] = useState(30); 
    
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    // 1. Logic Timer: Jalan otomatis jika resendTimer > 0
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // 2. Auto Submit jika OTP penuh
    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            handleVerify();
        }
    }, [otp]);

    const handleChange = (e, i) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[i] = value;
        setOtp(newOtp);
        
        if (value && i < 5) {
            inputsRef.current[i + 1].focus();
        }
    };

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace") {
            if (!otp[i] && i > 0) {
                e.preventDefault(); 
                const newOtp = [...otp];
                newOtp[i - 1] = ""; 
                setOtp(newOtp);
                inputsRef.current[i - 1].focus(); 
            }
        }
    };

    const handleVerify = async () => {
        const otp_code = otp.join("");
        if (otp_code.length !== 6) {
            if (!loading) {
                // Gunakan Toast atau Swal kecil untuk validasi input ringan
                Swal.fire({
                    icon: "warning",
                    title: "Invalid Input",
                    text: "Enter 6-digit OTP",
                    confirmButtonColor: "#00bfa6",
                });
            }
            return;
        }

        const sessionID = sessionStorage.getItem("sessionID");
        if (!sessionID) {
            Swal.fire({
                icon: "error",
                title: "Session Expired",
                text: "Please log in again.",
                confirmButtonColor: "#00bfa6",
            }).then(() => navigate("/"));
            return;
        }

        setLoading(true);
        try {
            const resp = await postVerifyOtp({ sessionID, otp_code });
            
            if (!resp.ok || !resp.data?.status) {
                Swal.fire({
                    icon: "error",
                    title: "Verification Failed",
                    text: resp.message || "Invalid OTP",
                    confirmButtonColor: "#d33",
                });
                setOtp(["", "", "", "", "", ""]);
                if (inputsRef.current[0]) inputsRef.current[0].focus();
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

            Swal.fire({
                icon: "success",
                title: "OTP Verified",
                text: "Login successful!",
                confirmButtonColor: "#00bfa6",
                timer: 1500, // Opsional: auto close sukses dalam 1.5s
                showConfirmButton: false
            }).then(() => {
                navigate("/dashboard", { replace: true });
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        // Cegah klik jika timer masih jalan
        if (resendTimer > 0) return;

        const sessionID = sessionStorage.getItem("sessionID");
        if (!sessionID) {
            Swal.fire({
                icon: "error",
                title: "Session Expired",
                text: "Please log in again.",
            }).then(() => navigate("/"));
            return;
        }

        try {
            const resp = await postResendOtp({ sessionID });

            if (!resp.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: resp.message || "Gagal mengirim ulang OTP",
                });
                return;
            }

            // Reset Timer & Input
            const cooldown = resp.data?.resendCooldown ?? 30;
            setResendTimer(cooldown);
            setOtp(["", "", "", "", "", ""]);
            inputsRef.current[0].focus();

            // Tampilkan Modal Konfirmasi (User harus klik OK)
            Swal.fire({
                icon: "success",
                title: "OTP Resent",
                text: resp.data.message || "Kode OTP baru telah dikirim ke email Anda.",
                confirmButtonColor: "#00bfa6",
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal menghubungi server.",
            });
        }
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
                            onKeyDown={(e) => handleKeyDown(e, i)} 
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
                        style={{ 
                            cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                            opacity: resendTimer > 0 ? 0.5 : 1
                        }}
                        onClick={handleResend}
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Click to resend"}
                    </span>
                </p>

                <div className="otp-back" onClick={() => navigate("/")}>
                    ← Back to Sign In
                </div>
            </div>
        </div>
    );
}