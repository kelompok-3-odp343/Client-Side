import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import NotificationPanel from "../Notification/Notification";

export default function Navbar() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const bellRef = useRef(null);

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-door-open navbar-logo"></i>
            <h1 className="navbar-title">
              wand<span className="o1">o</span>
              <span className="o2">o</span>r
            </h1>
          </div>

          <div className="navbar-right">
            <i
              ref={bellRef}
              className="fas fa-bell nav-icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotif((prev) => !prev);
              }}
            ></i>

            <i
              className="fas fa-user-circle nav-icon"
              onClick={() => navigate("/profile")}
            ></i>
          </div>
        </div>
      </nav>

      {showNotif && (
        <>
          <div
            className="notif-overlay"
            onClick={() => setShowNotif(false)}
          />
          <NotificationPanel visible={showNotif} anchorRef={bellRef} />
        </>
      )}
    </>
  );
}