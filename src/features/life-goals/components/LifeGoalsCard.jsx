import React from "react";
import "../styles/life-goals-card.css";

export default function LifeGoalsCard({ goal, onClick }) {
  const accent = goal.color || "#71d9d0";
  const percent = Math.round((goal.current / goal.target) * 100);

  return (
    <article
      className="lg-subcard"
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        "--gradient-color": `linear-gradient(to bottom, ${accent} 0%, #ffffff 100%)`,
      }}
    >
      <div className="lg-subcard-body">
        <div className="lg-subcard-top">
          <div>
            <h4 className="lg-subcard-title">{goal.title || goal.lifegoalsTitle}</h4>
            <p className="lg-subcard-subtitle">{goal.lifegoalsSubtitle}</p>
          </div>
        </div>

        <div className="lg-progress-container">
          <div className="lg-mini-progress">
            <div
              className="lg-mini-progress-fill"
              style={{ width: `${percent}%`, background: accent }}
            >
              <span className="lg-progress-text">{percent}%</span>
            </div>
          </div>

          <div className="lg-progress-labels">
            <span>Current Savings</span>
            <span>Target</span>
          </div>

          <div className="lg-progress-values">
            <span>Rp{goal.current.toLocaleString("id-ID")}</span>
            <span>Rp{goal.target.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </article>
  );
}