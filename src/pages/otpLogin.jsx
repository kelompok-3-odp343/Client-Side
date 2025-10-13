import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/otpStyle.css";

export default function InputEmail() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0); // 🔹 Tambah state untuk menghitung jumlah percobaan

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleVerify = async () => {
    if (!otp) {
      setMessage("⚠️ Please enter your OTP first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (API_BASE_URL) {
        // 🟢 Mode Online
        const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        });

        const data = await response.json();
        setLoading(false);

        if (data.success) {
          setMessage("✅ OTP Verified!");
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);

          if (newAttempts >= 3) {
            setMessage("🚫 Too many failed attempts. Redirecting...");
            setTimeout(() => navigate("/popupblock"), 1500);
          } else {
            setMessage(`❌ Invalid OTP. Attempt ${newAttempts}/3.`);
          }
        }
      } else {
        // 🟠 Mode Simulasi
        console.warn("⚙️ Running in SIMULATION MODE (no backend)");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (otp === "123456") {
          setMessage("✅ OTP Verified (Simulation Mode)!");
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);

          if (newAttempts >= 3) {
            setMessage("🚫 Too many failed attempts. Redirecting...");
            setTimeout(() => navigate("/popupblock"), 1500);
          } else {
            setMessage(`❌ Invalid OTP (Simulation Mode). Attempt ${newAttempts}/3.`);
          }
        }

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      setMessage("⚠️ Connection failed or simulation error.");
    }
  };

  return (
    <div className="input-email">
      <div className="card-otp">
        <h2 className="enter-the-code-we-ve">
          Enter the code we’ve just <br /> Sent to your Email Inbox
        </h2>

        <p className="we-ve-sent-a-sign-in">
          We’ve sent a sign-in code for Wandoor link to <br />
          example@gmail.com
        </p>

        <p className="text-wrapper-3">The Code OTP</p>

        <div className="group">
          <input
            type="text"
            maxLength="6"
            className="rectangle-3"
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <button
          className="open-email-now"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && <p className="otp-message">{message}</p>}

        <p className="didn-t-receive-the">
          Didn’t receive the email?{" "}
          <span className="text-wrapper-2">Click to resend</span>
        </p>

        <div
          className="back-to-sign"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", color: "#007bff" }}
        >
          ← Back to Sign In
        </div>
      </div>
    </div>
  );
}
