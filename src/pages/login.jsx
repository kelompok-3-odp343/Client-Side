import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/style.css";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Ambil URL backend dari .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim() || !password.trim()) {
      alert("Please fill in both fields!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (API_BASE_URL) {
        // 🟢 MODE ONLINE — kirim ke server backend
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        });

        const data = await response.json();
        setLoading(false);

        if (data.success) {
          localStorage.setItem("userEmail", data.email);
          //post api dari OTP
          navigate("/otpLogin");
        } else {
          setMessage("❌ Invalid credentials. Please try again.");
        }
      } else {
        // 🟠 MODE SIMULASI — belum ada backend
        console.warn("Running in simulation mode — no API_BASE_URL found");

        // Data dummy untuk simulasi login
        const dummyUsers = [
          { userId: "admin", password: "12345", email: "admin@demo.com" },
          { userId: "test", password: "abcd", email: "test@demo.com" },
        ];

        // Cek apakah userId dan password cocok
        const user = dummyUsers.find((u) => u.userId === userId && u.password === password);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay simulasi
        setLoading(false);

        if (user) {
          localStorage.setItem("userEmail", user.email);
          navigate("/otpLogin");
        } else {
          setMessage("❌ User ID or Password is incorrect (simulation mode).");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      setMessage("⚠️ Unable to connect to the server.");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <div
        className="login-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="login-header" style={{ textAlign: "center" }}>
          <h4>Welcome to</h4>
          <p>Secure Login Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* User ID */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-person-circle"></i>
            </span>
            <input type="text" className="form-control" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </div>

          {/* Password */}
          <div className="input-group mb-4">
            <span className="input-group-text">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="input-group-text">
              <i className="bi bi-eye"></i>
            </span>
          </div>

          <button type="submit" className="btn btn-login w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: "red",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}

        <div className="login-footer" style={{ textAlign: "center", marginTop: "20px" }}>
          <p>
            Forgot your password? <a href="#">Reset here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
