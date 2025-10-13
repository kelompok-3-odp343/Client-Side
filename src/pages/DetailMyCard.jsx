import React, { useState } from "react";
import "../css/detailMyCard.css";
import { EyeOff, Eye, Settings, Bell, User, Filter } from "lucide-react";

export default function DetailMyCard() {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitData, setSplitData] = useState({ name: "", amount: "" });

  const transactions = {
    May: [
      {
        date: "31 May 2025",
        type: "QRIS",
        detail: "Warung Kak Ros",
        amount: "-Rp25.000",
      },
      {
        date: "31 May 2025",
        type: "QRIS",
        detail: "Warung Kak Udin",
        amount: "-Rp25.000",
      },
      {
        date: "30 May 2025",
        type: "Transfer",
        detail: "BNI - Gajian uhuy",
        amount: "+Rp50.000.000",
      },
      {
        date: "30 May 2025",
        type: "E-Wallet",
        detail: "Top Up Ovo - 0123456789",
        amount: "-Rp25.000",
      },
    ],
    June: [
      {
        date: "01 June 2025",
        type: "Transfer",
        detail: "BNI - Payroll Bonus",
        amount: "+Rp10.000.000",
      },
      {
        date: "02 June 2025",
        type: "QRIS",
        detail: "Warung Kak Ros",
        amount: "-Rp50.000",
      },
    ],
    July: [],
  };

  const handleSplitSubmit = (e) => {
    e.preventDefault();
    alert(
      `Split bill created for ${splitData.name} with amount ${splitData.amount}`
    );
    setShowSplitModal(false);
    setSplitData({ name: "", amount: "" });
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
        <div className="logo-text" onClick={() => window.history.back()}>
          wandoor
        </div>
        <div className="header-icons">
          <Bell />
          <User />
          <Settings />
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* LEFT PANEL */}
        <section className="left-panel">
          <div className="account-details">
            <div className="account-details-dropdown">
              <h2>
                <strong>Account Details</strong>
              </h2>
              <select>
                <option>TAPLUS BISNIS - 1234567890</option>
              </select>
            </div>

            <p className="subtext">
              Track your transaction history and payment information
            </p>

            <div className="account-card">
              <div className="account-header">
                <div>
                  <h4>TAPLUS BISNIS</h4>
                  <p className="acc-number">
                    <strong>1234567890</strong>
                  </p>
                  <p className="acc-name">OKTAVIA QUBROI’A AYUNI</p>
                </div>
                <span className="badge">Main Account</span>
              </div>

              <p className="balance-title">Effective Balance</p>
              <div className="balance-container">
                <h3>{showBalance ? "Rp 25.000.000" : "•••••••••"}</h3>
                <span
                  className="eye-icon"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="warning-box">
              ⚠️ Do not share card number, expiration date, or CVV/CVC code to
              anyone, including BNI representatives.
            </div>
          </div>

          <div className="earnings">
            <h2>Earnings Overview</h2>
            <div className="numbers">
              <div>
                <h3>Rp17.580.062</h3>
                <p>
                  <strong>Income</strong>
                </p>
              </div>
              <div>
                <h3>Rp10.580.062</h3>
                <p>
                  <strong>Expenses</strong>
                </p>
              </div>
            </div>
            <p className="difference">
              <strong>A difference of Rp7.000.000,00</strong>
            </p>

            <div className="bar-chart">
              <div className="bar income-bar"></div>
              <div className="bar expense-bar"></div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="right-panel">
          <div className="transactions">
            <div className="transaction-header">
              <h2>Transaction History</h2>
              <Filter className="filter-icon" />
            </div>

            <div className="months">
              {[
                "May",
                "June",
                "July",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
              ].map((m) => (
                <button
                  key={m}
                  className={selectedMonth === m ? "active" : ""}
                  onClick={() => setSelectedMonth(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            {/* <div className="transaction-list-date">
              {transactions[selectedMonth]?.length ? (
                transactions[selectedMonth].map((t, i) => (
                  <div key={i} className="transaction-item">
                    <div className="transaction-info">
                      <p className="date">
                        <strong>{t.date}</strong>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No transactions available for {selectedMonth}
                </p>
              )}
            </div> */}
            <div className="transaction-list">
              {transactions[selectedMonth]?.length ? (
                transactions[selectedMonth].map((t, i) => (
                  <div key={i} className="transaction-item">
                    <div className="transaction-info">
                      <p className="date">
                        <strong>{t.date}</strong>
                      </p>
                      <p className="type">{t.type}</p>
                      <p className="detail">{t.detail}</p>
                    </div>
                    <div className="transaction-amount">
                      <p
                        className={`amount ${
                          t.amount.startsWith("+") ? "credit" : "debit"
                        }`}
                      >
                        {t.amount}
                      </p>
                      <button
                        className="split-btn"
                        onClick={() => setShowSplitModal(true)}
                      >
                        Split bill?
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No transactions available for {selectedMonth}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* SPLIT BILL MODAL */}
      {showSplitModal && (
        <div className="split-modal">
          <div className="split-box">
            <h3>Create Split Bill</h3>
            <form onSubmit={handleSplitSubmit}>
              <label>Friend’s Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={splitData.name}
                onChange={(e) =>
                  setSplitData({ ...splitData, name: e.target.value })
                }
                required
              />
              <label>Amount (Rp)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={splitData.amount}
                onChange={(e) =>
                  setSplitData({ ...splitData, amount: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowSplitModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
