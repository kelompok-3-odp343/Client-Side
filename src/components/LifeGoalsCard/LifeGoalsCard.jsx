import React from "react";
import "./LifeGoalsCard.css";

export default function LifeGoalsCard({ goal, onClick }) {
  return (
    <div className="goal-card" onClick={onClick}>
      <div
        className="goal-img-section"
        style={{ backgroundColor: goal.color }}
      >
        <img src={goal.icon} alt={goal.title} />
      </div>

      <div className="goal-info">
        <h3>{goal.title}</h3>
        <p>{goal.desc}</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${goal.progress}%`,
              backgroundColor: goal.color,
            }}
          ></div>
        </div>
        <div className="progress-text">
          <span>Rp{goal.current.toLocaleString("id-ID")}</span>
          <span>Rp{goal.target.toLocaleString("id-ID")}</span>
        </div>
      </div>
    </div>
  );
}