import React, { useState } from "react";
import "../css/cardstyle.css";
import { EyeOff, Eye, Settings, Bell, User, Filter } from "lucide-react";

export default function MyCards() {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const toggleCardNumber = () => setShowCardNumber(!showCardNumber);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="logo">Wandoor</h1>
        <div className="icons">
          <Settings />
          <Bell />
          <User />
        </div>
      </header>

      <main className="dashboard-main">
        {/* Left Section */}
        <section className="left-section">
          <h2>Account Information</h2>
          <p className="subtext">
            Track your transaction history and payment information
          </p>

          {/* Card Section */}
          <div className="card-container">
            <div className="card-gradient">
              <p className="bank-name">BNI Debit</p>
              <p className="card-number">
                {showCardNumber ? "1234 5678 9012 9100" : "1234 56** **** 9100"}
                <span onClick={toggleCardNumber} className="eye-icon">
                  {showCardNumber ? <Eye /> : <EyeOff />}
                </span>
              </p>
              <p className="cardholder">OKTAVIA QURROTA A’YUNI</p>
              <p className="account-type">TAPLUS BISNIS - 1234567890</p>
            </div>
          </div>

          <div className="warning-box">
            ⚠️ Jangan bagikan nomor kartu, tanggal kadaluarsa, dan kode CVV/CVC ke siapa pun.
          </div>

          <div className="earnings-box">
            <h3>Earnings Overview</h3>
            <div className="earnings-content">
              <div className="amount">
                <h4>Rp17.580.062</h4>
                <p className="income">Income</p>
              </div>
              <div className="amount">
                <h4>Rp10.580.062</h4>
                <p className="expenses">Expenses</p>
              </div>
            </div>
            <p className="difference">A difference of Rp7.000.000,00</p>
            <div className="bar-chart">
              <div className="bar income-bar"></div>
              <div className="bar expense-bar"></div>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="right-section">
          <div className="transaction-header">
            <h2>Transaction History</h2>
            <Filter className="filter-icon" />
          </div>

          <div className="month-tabs">
            {[
              "May", "June", "July", "Aug", "Sept", "Oct",
              "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
            ].map((month, i) => (
              <button key={i} className={`month-btn ${month === "May" ? "active" : ""}`}>
                {month}
              </button>
            ))}
          </div>

          <div className="transaction-list">
            <div className="date">31 May 2025</div>
            <div className="transaction-item">
              <span>QRIS</span>
              <p>Warung Kak Ros</p>
              <div className="amount negative">-Rp25.000</div>
              <span className="split">Split bill</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
