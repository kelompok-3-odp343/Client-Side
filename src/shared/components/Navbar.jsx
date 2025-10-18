import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/navbar.css";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    if (!showNotif) return;

    function handleOutside(e) {
      if (bellRef.current?.contains(e.target)) return;
      if (document.querySelector(".notif-panel")?.contains(e.target)) return;
      setShowNotif(false);
    }

    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [showNotif]);


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
                e.nativeEvent.stopImmediatePropagation();   // <-- ADD THIS
                setShowNotif(prev => !prev);
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
          {/* <div className="notif-overlay" /> */}
          <NotificationPanel visible={showNotif} anchorRef={bellRef} />
        </>
      )}
    </>
  );
}
