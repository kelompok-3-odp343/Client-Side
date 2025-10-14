import React, { useEffect, useRef } from "react";
import "./Notification.css";

export default function NotificationPanel({ visible, anchorRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (visible && panelRef.current && anchorRef?.current) {
      const bellRect = anchorRef.current.getBoundingClientRect();
      const panel = panelRef.current;

      const top = bellRect.bottom + 10; // sedikit di bawah lonceng
      const left = bellRect.right - panel.offsetWidth; // sejajar kanan lonceng

      panel.style.position = "fixed";
      panel.style.top = `${top}px`;
      panel.style.left = `${left}px`;
    }
  }, [visible, anchorRef]);

  if (!visible) return null;

  return (
    <div ref={panelRef} className="notif-panel fade-in">
      <h3 className="notif-title">Notifications</h3>

      <div className="notif-card notif-blue">
        <h4 className="notif-heading">October Special Promo!</h4>
        <p>Enjoy up to 20% cashback for transactions at selected merchants.</p>
      </div>

      <div className="notif-card notif-yellow">
        <h4 className="notif-heading">Weekend Deals</h4>
        <p>Use your debit card at the mall and enjoy discounts up to IDR 300,000.</p>
      </div>

      <div className="notif-card notif-orange">
        <h4 className="notif-heading">Free Interbank Transfers</h4>
        <p>Enjoy free interbank transfer fees until 20 May 2027.</p>
      </div>
    </div>
  );
}