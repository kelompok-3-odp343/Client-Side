import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/lifegoalsDetail.css";

import graduationIcon from "../assets/images/education.png";
import vacationIcon from "../assets/images/vacation.png";
import marriageIcon from "../assets/images/marriage.png";
import homeIcon from "../assets/images/home.png";
import gadgetIcon from "../assets/images/gadget.png";
import vehicleIcon from "../assets/images/vehicle.png";

export default function LifeGoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("May");

  const goals = {
    education: {
      title: "Education",
      desc: "Save for brighter dawn",
      color: "#71d9d0",
      icon: graduationIcon,
    },
    vacations: {
      title: "Vacations",
      desc: "Your Passport to New Memories",
      color: "#ffd367",
      icon: vacationIcon,
    },
    marriage: {
      title: "Marriage",
      desc: "Funding your new chapter",
      color: "#b18cff",
      icon: marriageIcon,
    },
    home: {
      title: "Home",
      desc: "Saving for Memories Unmade",
      color: "#d0a3ff",
      icon: homeIcon,
    },
    gadget: {
      title: "Gadget",
      desc: "Smart saving for smart tech",
      color: "#6fd6c1",
      icon: gadgetIcon,
    },
    vehicles: {
      title: "Vehicles",
      desc: "Fuel your future ride",
      color: "#ffd28a",
      icon: vehicleIcon,
    },
  };

  const goal = goals[id] || goals.education;

  const transactions = {
    May: [
      { date: "31 May 2025", type: "Others", desc: "Interest", amount: "+5.000" },
      { date: "31 May 2025", type: "Others", desc: "Tax", amount: "-1.000" },
      { date: "25 May 2025", type: "Autodebit", desc: "Life Goals Deposit", amount: "+2.000.000" },
      { date: "5 May 2025", type: "Top Up", desc: "Life Goals Deposit", amount: "+250.000" },
    ],
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <div className="lifegoal-detail-container">
      <Navbar />
      <main className="lifegoal-detail-main">
        <button
          className="back-link"
          onClick={() => navigate("/lifegoals")}
          style={{ color: goal.color }}
        >
          ← Back to Life Goals
        </button>

        <h2 className="page-title">Life Goals Progress</h2>
        <p className="subtitle">Small saves fuel big dreams</p>

        {/* === TOP CARD === */}
        <div className="goal-header-card">
          <div className="goal-header-left" style={{ backgroundColor: goal.color }}>
            <img src={goal.icon} alt={goal.title} />
          </div>

          <div className="goal-header-right">
            <h3>{goal.title}</h3>
            <p>{goal.desc}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "50%", backgroundColor: goal.color }}
              ></div>
            </div>
            <div className="progress-text">
              <span>Rp50.000.000</span>
              <span>Rp100.000.000</span>
            </div>
          </div>
        </div>

        {/* === MAIN GRID === */}
        <div className="lifegoal-grid">
          {/* === LEFT SECTION === */}
          <section className="history-section">
            <h3>History</h3>
            <div className="month-selector">
              {months.map((m) => (
                <button
                  key={m}
                  className={`month-btn ${selectedMonth === m ? "active" : ""}`}
                  onClick={() => setSelectedMonth(m)}
                  style={
                    selectedMonth === m
                      ? { backgroundColor: goal.color, color: "#fff" }
                      : {}
                  }
                >
                  {m}
                </button>
              ))}
            </div>

            {transactions[selectedMonth]?.map((tx, i) => (
              <div className="tx-card" key={i}>
                <p className="tx-date">{tx.date}</p>
                <div className="tx-row">
                  <div>
                    <p className="tx-type">{tx.type}</p>
                    <span className="tx-desc">{tx.desc}</span>
                  </div>
                  <p
                    className={`tx-amount ${
                      tx.amount.startsWith("-") ? "negative" : "positive"
                    }`}
                  >
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* === RIGHT SECTION === */}
          <section className="info-section">
            <h3>Life Goals Information</h3>

            <div className="info-box">
              <h4>Life Goals Detail</h4>
              <div className="info-row">
                <span>Life Goals Account</span>
                <span>1234567890</span>
              </div>
              <div className="info-row">
                <span>Estimated Accumulated Funds</span>
                <span>Rp50.000.000</span>
              </div>
              <div className="info-row">
                <span>Initial Deposit</span>
                <span>Rp100.000</span>
              </div>
              <div className="info-row">
                <span>Annual Interest Rate</span>
                <span>3%</span>
              </div>
              <div className="info-row">
                <span>Duration</span>
                <span>5 years</span>
              </div>
              <div className="info-row">
                <span>Creation Date</span>
                <span>25 May 2023</span>
              </div>
            </div>

            <div className="info-box">
              <h4>Disbursement Details</h4>
              <div className="info-row">
                <span>Disbursement Date</span>
                <span>25 May 2028</span>
              </div>
              <div className="info-row">
                <span>Disbursement Account</span>
                <span>1234567890</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}