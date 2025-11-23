import React, { useState, useRef, useEffect } from "react";
import { usePageLoader } from "../hooks/usePageLoader";
import "../styles/components/navbar.css";
import NotificationPanel from "./NotificationPanel";
import logo from "../../assets/images/wandoor-logo-2.png";

export default function Navbar({ title }) {
  const navigate = usePageLoader();
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
            <img src={logo} alt="Wandoor Logo" className="navbar-logo-img" />
          </div>

          <div className="navbar-center">
            {title && <h1 className="navbar-title">{title}</h1>}
          </div>

          <div className="navbar-right">
            <i
              ref={bellRef}
              className="fas fa-bell nav-icon"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
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

      {showNotif && <NotificationPanel visible={showNotif} anchorRef={bellRef} />}
    </>
  );
}