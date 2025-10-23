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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage("Please fill in both fields")
      return;
    }

    setLoading(true);
    setMessage("");

    const respLogin = await postAuthLogin({
      username: username,
      password: password
    });

    setLoading(false);

    if (!respLogin.ok) {
      setMessage(respLogin.message || 'Invalid Username or Password');
      return;
    }

    sessionStorage.setItem("otp_ref", respLogin.data.otpRef)

    navigate("/otpLogin");
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