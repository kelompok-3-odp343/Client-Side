import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginApi } from "../../data/auth";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { email } = await loginApi(userId, password);
      localStorage.setItem("userEmail", email);
      navigate("/otpLogin");
    } catch (err) {
      setMessage("❌ " + err.message);
      setUserId("");
      setPassword("");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background">
      <div className="login-box fade-in">
        <div className="logo">
          <i className="fas fa-door-open"></i>
          <h1>
            wand<span className="o1">o</span>
            <span className="o2">o</span>r
          </h1>
        </div>

        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
              className={`far ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } toggle-eye`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="login-error">{message}</p>}
      </div>
    </div>
  );
}