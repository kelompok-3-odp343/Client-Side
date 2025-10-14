import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./LifeGoalsDetail.css";

import graduationIcon from "../../assets/images/education.png";
import vacationIcon from "../../assets/images/vacation.png";
import marriageIcon from "../../assets/images/marriage.png";
import homeIcon from "../../assets/images/home.png";
import gadgetIcon from "../../assets/images/gadget.png";
import vehicleIcon from "../../assets/images/vehicle.png";

export default function LifeGoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMonth, setSelectedMonth] = useState("May");

  const goals = {
    education: { title: "Education", desc: "Save for brighter dawn", color: "#71d9d0", icon: graduationIcon },
    vacations: { title: "Vacations", desc: "Your Passport to New Memories", color: "#ffd367", icon: vacationIcon },
    marriage: { title: "Marriage", desc: "Funding your new chapter", color: "#9c7edc", icon: marriageIcon },
    home: { title: "Home", desc: "Saving for Memories Unmade", color: "#9c7edc", icon: homeIcon },
    gadget: { title: "Gadget", desc: "Smart saving for smart tech", color: "#6dddd0", icon: gadgetIcon },
    vehicles: { title: "Vehicles", desc: "Fuel your future ride", color: "#ffd367", icon: vehicleIcon },
  };

  const goal = location.state?.goal || goals[id] || goals.education;

  const months = ["May","Jun","Jul","Aug","Sept","Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
  const transactions = {
    May: [
      { date: "31 May 2025", items: [
        { type: "Others", desc: "Interest", amount: "+5.000" },
        { type: "Others", desc: "Tax", amount: "-Rp1.000" },
      ]},
      { date: "25 May 2025", items: [
        { type: "Autodebit", desc: "Life Goals Deposit", amount: "+Rp2.000.000" },
      ]},
      { date: "5 May 2025", items: [
        { type: "Top Up", desc: "Life Goals Deposit", amount: "+Rp250.000" },
      ]},
    ],
  };

  return (
    <div className="lg-container" style={{ "--theme": goal.color }}>
      <Navbar />
      <main className="lg-main">
        <button className="lg-back" onClick={() => navigate("/lifegoals")}>← Back to Life Goals</button>

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
                    <div className="progress-fill" style={{ width: "50%", background: "var(--theme)" }} />
                  </div>
                  <div className="progress-values">
                    <span>Rp50.000.000</span>
                    <span>Rp100.000.000</span>
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
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="info-column">
            <h3 className="info-title">Life Goals Information</h3>

            <div className="info-card">
              <h4 className="info-heading">Life Goals Detail</h4>
              <div className="info-grid">
                <div className="label">Life Goals Account</div><div className="value">1234567890</div>
                <div className="label">Estimated Accumulated Funds</div><div className="value">Rp50.000.000</div>
                <div className="label">Initial Deposit</div><div className="value">Rp100.000</div>
                <div className="label">Annual Interest Rate</div><div className="value">3%</div>
                <div className="label">Duration</div><div className="value">5 years</div>
                <div className="label">Creation Date</div><div className="value">25 May 2023</div>
              </div>

              <div className="divider" />

              <h4 className="info-heading small">Disbursement Details</h4>
              <div className="info-grid">
                <div className="label">Disbursement Date</div><div className="value">25 May 2028</div>
                <div className="label">Disbursement Account</div><div className="value">1234567890</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}