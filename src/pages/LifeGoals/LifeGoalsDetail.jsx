import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./LifeGoalsDetail.css";
import { fetchLifeGoalDetail } from "../../data/lifeGoalsDetail";

export default function LifeGoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [goalDetail, setGoalDetail] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);

  const goal = location.state?.goal || {
    id,
    title: "Life Goal",
    desc: "Grow your dreams with consistent saving",
    color: "#71d9d0",
    progress: 0,
    current: 0,
    target: 0,
  };

  const months = ["May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  useEffect(() => {
    const loadGoal = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId") || "dummyUser123";
        const res = await fetchLifeGoalDetail(userId, id);
        setGoalDetail(res.detail);
        setTransactions(res.transactions);
      } catch (err) {
        console.error("Failed to fetch goal detail:", err);
        setGoalDetail(null);
        setTransactions({});
      } finally {
        setLoading(false);
      }
    };
    loadGoal();
  }, [id]);

  if (loading) return <div className="loading">Loading goal details...</div>;
  if (!goalDetail) return <div className="error">Goal not found</div>;

  const progressPct = Math.round((goalDetail.current_savings / goalDetail.target) * 100);

  return (
    <div className="lg-container" style={{ "--theme": goal.color }}>
      <Navbar />
      <main className="lg-main">
        <button className="lg-back" onClick={() => navigate("/lifegoals")}>
          ← Back to Life Goals
        </button>

        <div className="lg-grid">
          {/* LEFT COLUMN */}
          <div className="left-column">
            <header className="section-header">
              <h1 className="lg-title">Life Goals Progress</h1>
              <p className="lg-sub">Small saves fuel big dreams</p>
            </header>

            <section className="lg-topcard">
              <div className="topcard-left" style={{ background: "var(--theme)" }}>
                <img src={goal.icon} alt={goal.title} />
              </div>

              <div className="topcard-right">
                <div className="top-row">
                  <div>
                    <h2 className="goal-title">{goal.title}</h2>
                    <p className="goal-desc">{goal.desc}</p>
                  </div>
                  <div className="meta">
                    <div className="meta-left">Current Savings</div>
                    <div className="meta-right">Target</div>
                  </div>
                </div>

                <div className="top-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPct}%`, background: "var(--theme)" }}
                    />
                  </div>
                  <div className="progress-values">
                    <span>Rp{goalDetail.current_savings.toLocaleString()}</span>
                    <span>Rp{goalDetail.target.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="history-panel">
              <div className="panel-header">
                <h3 className="panel-title">Transaction History</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="download-icon"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <div className="months-row">
                {months.map((m) => (
                  <button
                    key={m}
                    className={`month-pill ${selectedMonth === m ? "active" : ""}`}
                    onClick={() => setSelectedMonth(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="tx-list">
                {transactions[selectedMonth]?.map((group, gi) => (
                  <div key={gi} className="tx-group">
                    <div className="tx-date">{group.date}</div>
                    {group.items.map((tx, i) => (
                      <div key={i} className="tx-row">
                        <div className="tx-left">
                          <div className="tx-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                          </div>
                          <div className="tx-text">
                            <div className="tx-type">{tx.type}</div>
                            <div className="tx-sub">{tx.desc}</div>
                          </div>
                        </div>
                        <div className={`tx-amount ${tx.amount.startsWith("-") ? "neg" : "pos"}`}>
                          {tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )) || <p>No transactions found</p>}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="info-column">
            <h3 className="info-title">Life Goals Information</h3>

            <div className="info-card">
              <h4 className="info-heading">Life Goals Detail</h4>
              <div className="info-grid">
                <div className="label">Life Goals Account</div>
                <div className="value">{goalDetail.account_number}</div>
                <div className="label">Estimated Accumulated Funds</div>
                <div className="value">
                  Rp{goalDetail.estimated_funds.toLocaleString()}
                </div>
                <div className="label">Initial Deposit</div>
                <div className="value">
                  Rp{goalDetail.initial_deposit.toLocaleString()}
                </div>
                <div className="label">Annual Interest Rate</div>
                <div className="value">{goalDetail.annual_interest}</div>
                <div className="label">Duration</div>
                <div className="value">{goalDetail.duration}</div>
                <div className="label">Creation Date</div>
                <div className="value">{goalDetail.created_at}</div>
              </div>

              <div className="divider" />

              <h4 className="info-heading small">Disbursement Details</h4>
              <div className="info-grid">
                <div className="label">Disbursement Date</div>
                <div className="value">{goalDetail.disbursement_date}</div>
                <div className="label">Disbursement Account</div>
                <div className="value">{goalDetail.disbursement_account}</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}