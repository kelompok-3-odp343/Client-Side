import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import "../styles/life-goals-detail.css";
import { fetchLifeGoalTransactions, fetchLifeGoalDetail } from "../api/life-goals.api";

export default function LifeGoalDetail() {
  const { id } = useParams();
  const location = useLocation();
  const goal = location.state?.goal;
  const [transactions, setTransactions] = useState({});
  const [goalDetail, setGoalDetail] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [loading, setLoading] = useState(false);

  const months = ["May","Jun","Jul","Aug","Sept","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [txData, detailData] = await Promise.all([
        fetchLifeGoalTransactions("USER001", id),
        fetchLifeGoalDetail("USER001", id),
      ]);
      setTransactions(txData);
      setGoalDetail(detailData);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading || !goalDetail) return <div className="loading">Loading...</div>;

  return (
    <div className="lg-container" style={{ "--theme": goal.color }}>
      <Navbar />
      <main className="lg-main">
        <div className="lg-grid">
          <div className="left-column">
            <header className="section-header">
              <h1 className="lg-title">{goal.title} Progress</h1>
              <p className="lg-sub">{goal.desc}</p>
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
                    <div className="meta-left">Current</div>
                    <div className="meta-right">Target</div>
                  </div>
                </div>

                <div className="top-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${goal.progress}%`,
                        background: "var(--theme)",
                      }}
                    />
                  </div>
                  <div className="progress-values">
                    <span>Rp{goal.current.toLocaleString("id-ID")}</span>
                    <span>Rp{goal.target.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="history-panel">
              <div className="panel-header">
                <h3 className="panel-title">Transaction History</h3>
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
                ))}
              </div>
            </section>
          </div>

          <aside className="info-column">
            <h3 className="info-title">Life Goals Information</h3>
            <div className="info-card">
              <h4 className="info-heading">Life Goals Detail</h4>
              <div className="info-grid">
                <div className="label">Life Goals Account</div>
                <div className="value">{goalDetail.life_goals_account}</div>

                <div className="label">Estimated Accumulated Funds</div>
                <div className="value">
                  Rp{goalDetail.estimated_accumulated_funds.toLocaleString("id-ID")}
                </div>

                <div className="label">Initial Deposit</div>
                <div className="value">
                  Rp{goalDetail.initial_deposit.toLocaleString("id-ID")}
                </div>

                <div className="label">Annual Interest Rate</div>
                <div className="value">{goalDetail.annual_interest_rate}</div>

                <div className="label">Duration</div>
                <div className="value">{goalDetail.duration_years} years</div>

                <div className="label">Creation Date</div>
                <div className="value">{goalDetail.creation_date}</div>
              </div>

              <div className="divider" />

              <h4 className="info-heading small">Disbursement Details</h4>
              <div className="info-grid">
                <div className="label">Disbursement Date</div>
                <div className="value">{goalDetail.disbursement_date}</div>

                <div className="label">Disbursement Account</div>
                <div className="value">{goalDetail.life_goals_account}</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}