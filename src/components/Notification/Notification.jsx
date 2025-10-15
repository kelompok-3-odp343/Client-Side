import React, { useEffect, useRef, useState } from "react";
import "./Notification.css";
import { fetchNotifications } from "../../data/notifications";

export default function NotificationPanel({ visible, anchorRef }) {
  const panelRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // === Ambil data langsung tanpa delay visual ===
  useEffect(() => {
    if (visible) {
      fetchNotifications().then(setNotifications).catch(() => setNotifications([]));
    }
  }, [visible]);

  // === Posisi panel dinamis ===
  useEffect(() => {
    if (visible && panelRef.current && anchorRef?.current) {
      const bellRect = anchorRef.current.getBoundingClientRect();
      const panel = panelRef.current;
      const top = bellRect.bottom + 10;
      const left = bellRect.right - panel.offsetWidth;
      panel.style.position = "fixed";
      panel.style.top = `${top}px`;
      panel.style.left = `${left}px`;
    }
  }, [visible, anchorRef]);

  if (!visible) return null;

  return (
    <div ref={panelRef} className="notif-panel fade-in">
      <h3 className="notif-title">Notifications</h3>

      {notifications.length === 0 ? (
        <p className="notif-empty">No notifications available</p>
      ) : (
        notifications.map((notif, i) => (
          <div key={i} className={`notif-card ${getColorClass(notif.type)}`}>
            <h4 className="notif-heading">{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

function getColorClass(type) {
  switch (type) {
    case "info": return "notif-blue";
    case "promo": return "notif-yellow";
    case "alert": return "notif-orange";
    default: return "notif-blue";
  }
}