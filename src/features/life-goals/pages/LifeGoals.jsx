import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import { fetchLifeGoalsRevamp } from "../api/life-goals.api";
import "../styles/life-goals.css";
import "../styles/life-goals-card.css";
import { useNavigate } from "react-router-dom";

export default function LifeGoals() {
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const COLORS = ["#71d9d0", "#ffd367", "#9c7edc"];

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchLifeGoalsRevamp();
      setGoals(res?.data || {});
      setLoading(false);
    };
    loadData();
  }, []);

  const format = (v) => `Rp${(v || 0).toLocaleString("id-ID")}`;
  const percent = (cur, tar) => (tar ? Math.round((cur / tar) * 100) : 0);

  if (loading) return <div className="loading">Loading...</div>;

  const colorByIndex = (idx) => COLORS[idx % COLORS.length];

  return (
    <div className="life-goals-page">
      <Navbar />
      <div className="content-wrap">
        <h2 className="section-title">Life Goals Information</h2>
        <p className="section-subtitle">Small saves fuel big dreams</p>

        {Object.entries(goals).map(([cat, data], i) => {
          const color = colorByIndex(i);
          const prog = percent(data.currentBalance, data.totalTarget);

          return (
            <section key={cat} className="category-block">
              <div className="category-header">
                <div>
                  <h3 className="category-title">{cat}</h3>
                  <p className="category-subtitle">
                    Invest in your brightest future
                  </p>
                </div>
                <div className="category-total">
                  {format(data.currentBalance)} / {format(data.totalTarget)}
                </div>
              </div>

              <div className="big-progress">
                <div
                  className="big-progress-fill"
                  style={{ width: `${prog}%`, background: color }}
                />
              </div>
              <p className="big-progress-meta">{prog}% achieved</p>

              <div className="subcards-grid">
                {data.lifeGoalsList.map((g) => {
                  const p = percent(g.currentBalance, g.targetBalance);
                  return (
                    <div
                      key={g.accountNumber}
                      className="lg-subcard"
                      style={{
                        "--gradient-color": `linear-gradient(to bottom, ${color} 0%, #ffffff 100%)`,
                      }}
                      onClick={() =>
                        navigate(`/lifegoal/${g.accountNumber}`, {
                          state: {
                            accountNumber: g.accountNumber,
                            goal: {
                              title: g.lifegoalsTitle,
                              desc: g.lifegoalsSubtitle,
                              current: g.currentBalance,
                              target: g.targetBalance,
                              progress: percent(
                                g.currentBalance,
                                g.targetBalance
                              ),
                              color,
                            },
                          },
                        })
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/lifegoal/${g.accountNumber}`, {
                            state: {
                              accountNumber: g.accountNumber,
                              goal: {
                                title: g.lifegoalsTitle,
                                desc: g.lifegoalsSubtitle,
                                current: g.currentBalance,
                                target: g.targetBalance,
                                progress: percent(
                                  g.currentBalance,
                                  g.targetBalance
                                ),
                                color,
                              },
                            },
                          });
                        }
                      }}
                      aria-label={`Open details for ${g.lifegoalsTitle}`}
                    >
                      <div className="lg-subcard-body">
                        <h4 className="lg-subcard-title">
                          {g.lifegoalsTitle}
                        </h4>
                        <p className="lg-subcard-subtitle">
                          {g.lifegoalsSubtitle}
                        </p>

                        <div className="lg-progress-wrap">
                          <div className="lg-mini-progress">
                            <div
                              className="lg-mini-progress-fill"
                              style={{ width: `${p}%`, background: color }}
                            >
                              <span className="lg-progress-text">{p}%</span>
                            </div>
                          </div>

                          <div className="lg-progress-labels">
                            <span>Current Savings</span>
                            <span>Target</span>
                          </div>
                          <div className="lg-progress-values">
                            <span>{format(g.currentBalance)}</span>
                            <span>{format(g.targetBalance)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="category-separator" />
            </section>
          );
        })}
      </div>
    </div>
  );
}