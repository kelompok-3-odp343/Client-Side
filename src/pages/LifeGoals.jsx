import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../css/lifegoals.css";
import LifeGoalCard from "../components/LifeGoalsCard";
import { fetchLifeGoals } from "../api/lifeGoalsApi";
import LIFE_GOALS_META from "../constants/lifeGoalsMeta";

export default function LifeGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [disbursementAccount, setDisbursementAccount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadGoals() {
      setLoading(true);
      const data = await fetchLifeGoals("USER001");
      const merged = data.goals.map((g) => {
        const meta = LIFE_GOALS_META[g.goal_id];
        const progress = g.target ? Math.round((g.current / g.target) * 100) : 0;
        return { ...meta, ...g, progress };
      });
      setDisbursementAccount(data.disbursement_account);
      setGoals(merged);
      setLoading(false);
    }
    loadGoals();
  }, []);

  if (loading) return <div className="loading">Loading Life Goals...</div>;

  return (
    <div className="life-goals-page">
      <Navbar />
      <h2 className="section-title">Life Goals Information</h2>
      <p className="section-subtitle">Small saves fuel big dreams</p>

      <div className="life-goal-grid">
        {goals.map((goal) => (
          <LifeGoalCard
            key={goal.goal_id}
            goal={goal}
            onClick={() =>
              navigate(`/lifegoal/${goal.goal_id}`, {
                state: { goal, disbursementAccount },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}