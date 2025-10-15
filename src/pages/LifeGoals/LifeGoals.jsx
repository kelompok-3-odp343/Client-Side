import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./LifeGoals.css";
import LifeGoalCard from "../../components/LifeGoalsCard/LifeGoalsCard";
import { fetchLifeGoals } from "../../data/lifeGoals";

export default function LifeGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId") || "dummyUser123";
        const data = await fetchLifeGoals(userId);
        setGoals(data);
      } catch (err) {
        console.error("Failed to fetch life goals:", err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, []);

  if (loading) return <div className="loading">Loading life goals...</div>;

  return (
    <div className="life-goals-page">
      <Navbar />
      <h2 className="section-title">Life Goals Information</h2>
      <p className="section-subtitle">Small saves fuel big dreams</p>

      <div className="life-goal-grid">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <LifeGoalCard
              key={goal.id}
              goal={goal}
              onClick={() => navigate(`/lifegoal/${goal.id}`, { state: { goal } })}
            />
          ))
        ) : (
          <p>No life goals found.</p>
        )}
      </div>
    </div>
  );
}