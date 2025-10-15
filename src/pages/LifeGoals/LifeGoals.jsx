import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LifeGoalCard from "../../components/LifeGoalsCard/LifeGoalsCard";
import "./LifeGoals.css";
import { fetchLifeGoals } from "../../data/lifeGoals";

export default function LifeGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || "USR001";

    const loadGoals = async () => {
      const data = await fetchLifeGoals(userId);
      setGoals(data);
    };

    loadGoals();
  }, []);

  return (
    <div className="life-goals-page">
      <Navbar />
      <h2 className="section-title">Life Goals Information</h2>
      <p className="section-subtitle">Small saves fuel big dreams</p>

      <div className="life-goal-grid">
        {goals.map((goal) => (
          <LifeGoalCard
            key={goal.id}
            goal={goal}
            onClick={() =>
              navigate(`/lifegoal/${goal.id}`, { state: { goal } })
            }
          />
        ))}
      </div>
    </div>
  );
}