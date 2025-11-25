import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import { fetchLifeGoalsRevamp } from "../api/life-goals.api";
import "../styles/life-goals.css";
import "../styles/life-goals-card.css";
import { useNavigate } from "react-router-dom";

export default function LifeGoals() {
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const COLORS = ["#6dddd0", "#ffd367", "#9c7edc"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchLifeGoalsRevamp();
        setGoals(res?.data || {});
      } catch (err) {
        console.error("Error loading life goals:", err);
        setError(err.message || "Failed to load life goals");
        setGoals({});
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const format = (v) => `Rp${(v || 0).toLocaleString("id-ID")}`;
  const percent = (cur, tar) => (tar ? Math.round((cur / tar) * 100) : 0);

  if (loading) {
    return (
      <div className="life-goals-page">
        <Navbar />
        <div className="content-wrap">
          <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="life-goals-page">
        <Navbar />
        <div className="content-wrap">
          <h2 className="section-title-lg">Life Goals Information</h2>
          <p className="section-subtitle">Small saves fuel big dreams</p>
          
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Unable to Load Life Goals</h3>
            <p style={{ color: "#777", margin: "1rem 0" }}>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!goals || Object.keys(goals).length === 0) {
    return (
      <div className="life-goals-page">
        <Navbar />
        <div className="content-wrap">
          <h2 className="section-title-lg">Life Goals Information</h2>
          <p className="section-subtitle">Small saves fuel big dreams</p>

          <p className="no-life-goals" style={{ fontSize: "0.85rem", fontWeight: "600", textAlign: 'center', padding: '2rem' }}>
            No life goals available.
          </p>
        </div>
      </div>
    );
  }

  const colorByIndex = (idx) => COLORS[idx % COLORS.length];

  return (
    <div className="life-goals-page">
      <Navbar />
      <div className="content-wrap">

        <h2 className="section-title-lg">Life Goals Information</h2>
        <p className="section-subtitle">Small saves fuel big dreams</p>
        <div className="category-separator" />

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
              </div>

              <div className="big-progress">
                <div className="big-progress-bar">
                  <div
                    className="big-progress-fill"
                    style={{ width: `${prog}%`, background: color }}
                  >
                    <span className="big-progress-meta">{prog}%</span>
                  </div>
                </div>
                <div className="category-total">
                  {format(data.currentBalance)} / {format(data.totalTarget)}
                </div>
              </div>

              <div className="subcards-grid">
                {!data?.lifegoalslist || data.lifegoalslist.length === 0 ? (
                  <div className="lg-empty">No Life Goals found</div>
                ) : (
                  data.lifegoalslist.map((g) => {
                    const p = percent(g.currentBalance, g.targetBalance);

                    return (
                      <div
                        key={g.accountNumber}
                        className="lg-subcard"
                        style={{
                          "--gradient-color": `linear-gradient(to bottom, ${color} 0%, #ffffff 50%)`,
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
                                progress: p,
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
                                  progress: p,
                                  color,
                                },
                              },
                            });
                          }
                        }}
                        aria-label={`Open details for ${g.lifegoalsTitle}`}
                      >
                        <div className="lg-subcard-body">
                          <h4 className="lg-subcard-title">{g.lifegoalsTitle}</h4>
                          <p className="lg-subcard-subtitle">{g.lifegoalsSubtitle}</p>

                          <div className="lg-progress-wrap">
                            <div className="lg-progress-labels">
                              <span>Current Savings</span>
                              <span>Target</span>
                            </div>

                            <div className="lg-mini-progress">
                              <div
                                className="lg-mini-progress-fill"
                                style={{ width: `${p}%`, background: color }}
                              >
                                <span className="lg-progress-text">{p}%</span>
                              </div>
                            </div>

                            <div className="lg-progress-values">
                              <span>{format(g.currentBalance)}</span>
                              <span>{format(g.targetBalance)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}