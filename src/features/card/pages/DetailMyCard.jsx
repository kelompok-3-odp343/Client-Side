import React, { useState } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye, Filter } from "lucide-react";

export default function DetailMyCard() {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const transactions = {
    May: [
      {
        date: "31 May 2025",
        items: [
          { type: "QRIS", detail: "Warung Kak Ros", amount: "-Rp25.000" },
          { type: "QRIS", detail: "Warung Kak Udin", amount: "-Rp25.000" },
        ],
      },
      {
        date: "30 May 2025",
        items: [
          {
            type: "Transfer",
            detail: "BNI - Gajian uhuy",
            amount: "+Rp50.000.000",
          },
          {
            type: "E-Wallet",
            detail: "Top Up Ovo - 0123456789",
            amount: "-Rp25.000",
          },
        ],
      },
    ],
    June: [
      {
        date: "01 June 2025",
        items: [
          {
            type: "Transfer",
            detail: "BNI - Payroll Bonus",
            amount: "+Rp10.000.000",
          },
        ],
      },
      {
        date: "02 June 2025",
        items: [
          { type: "QRIS", detail: "Warung Kak Ros", amount: "-Rp50.000" },
        ],
      },
    ],
    July: [],
  };

  return (
    <div className="detail-mycard">
      {/* HEADER */}
      <Navbar />

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
                <div className="account-card-badge">
                  <span>Main Account</span>
                </div>
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
              ⚠️ Do not share card number, expiration date, or CVV/CVC code with
              anyone.
            </div>
          </div>

          <h5>Earnings Overview</h5>

          <div className="earnings">
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
              <strong>A difference of Rp7.000.000</strong>
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
              <h3>Transaction History</h3>
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

            <div className="transaction-list-modern">
              {transactions[selectedMonth]?.length ? (
                transactions[selectedMonth].map((group, idx) => (
                  <div key={idx} className="transaction-group">
                    <p className="transaction-date">
                      <strong>{group.date}</strong>
                    </p>
                    <hr />
                    {group.items.map((item, i) => (
                      <div key={i} className="transaction-modern-item">
                        <div className="transaction-text">
                          <p className="transaction-type">{item.type}</p>
                          <p className="transaction-detail">{item.detail}</p>
                        </div>
                        <div className="transaction-amount-modern">
                          <span
                            className={`amount ${item.amount.startsWith("+") ? "credit" : "debit"
                              }`}
                          >
                            {item.amount}
                          </span>
                          <button
                            className="split-btn"
                            onClick={() => setShowSplitModal(true)}
                          >
                            Split bill?
                          </button>
                        </div>
                      </div>
                    ))}
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
      {showSplitModal && (
        <div className="modal-overlay">
          <SplitBillForm
            onClose={() => setShowSplitModal(false)}
            transaction={{
              id: "ldx01231231sadawq",
              date: "31 May 2025",
              detail: "Warung Kak Udin",
              amount: "Rp25.000",
            }}
          />
        </div>
      )}
    </div>
  );
}
