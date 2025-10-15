import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SplitBillForm from "../../components/SplitBill/SplitBill";
import "./DetailMyCard.css";
import { EyeOff, Eye, Filter } from "lucide-react";
import { fetchCardDetails, fetchCardTransactions } from "../../data/card";

export default function DetailMyCard() {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [card, setCard] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || "USR001";
    const accountNumber = "1234567890"; // bisa diganti dynamic param dari router

    const loadCard = async () => {
      const res = await fetchCardDetails(userId, accountNumber);
      setCard(res.data);
    };

    const loadTransactions = async () => {
      const res = await fetchCardTransactions(userId, accountNumber, selectedMonth);
      setTransactions(res.data);
    };

    loadCard();
    loadTransactions();
  }, [selectedMonth]);

  const grouped = transactions.reduce((acc, tx) => {
    acc[tx.trx_date] = acc[tx.trx_date] ? [...acc[tx.trx_date], tx] : [tx];
    return acc;
  }, {});

  if (!card) return <div className="loading">Loading card details...</div>;

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="main">
        {/* LEFT PANEL */}
        <section className="left-panel">
          <div className="account-details">
            <div className="account-details-dropdown">
              <h2><strong>Account Details</strong></h2>
              <select>
                <option>{card.type} - {card.account_number}</option>
              </select>
            </div>

            <p className="subtext">
              Track your transaction history and payment information
            </p>

            <div className="account-card">
              <div className="account-header">
                <div>
                  <h4>{card.type}</h4>
                  <p className="acc-number"><strong>{card.account_number}</strong></p>
                  <p className="acc-name">{card.account_holder_name}</p>
                </div>
                {card.is_main_account && <span className="badge">Main Account</span>}
              </div>

              <p className="balance-title">Effective Balance</p>
              <div className="balance-container">
                <h3>{showBalance ? `Rp ${card.effective_balance.toLocaleString()}` : "•••••••••"}</h3>
                <span className="eye-icon" onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="warning-box">
              ⚠️ Do not share card number, expiration date, or CVV/CVC code with anyone.
            </div>
          </div>

          <h5>Earnings Overview</h5>

          <div className="earnings">
            <div className="numbers">
              <div>
                <h3>Rp{card.earnings_overview.income.toLocaleString()}</h3>
                <p><strong>Income</strong></p>
              </div>
              <div>
                <h3>Rp{card.earnings_overview.expenses.toLocaleString()}</h3>
                <p><strong>Expenses</strong></p>
              </div>
            </div>
            <p className="difference">
              <strong>A difference of Rp{card.earnings_overview.difference.toLocaleString()}</strong>
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
              {["May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => (
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
              {transactions.length > 0 ? (
                Object.keys(grouped).map((date) => (
                  <div key={date} className="transaction-group">
                    <p className="transaction-date"><strong>{date}</strong></p>
                    <hr />
                    {grouped[date].map((item, i) => (
                      <div key={i} className="transaction-modern-item">
                        <div className="transaction-text">
                          <p className="transaction-type">{item.trx_type}</p>
                          <p className="transaction-detail">{item.trx_note}</p>
                        </div>
                        <div className="transaction-amount-modern">
                          <span className={`amount ${item.trx_amount > 0 ? "credit" : "debit"}`}>
                            {item.trx_amount > 0
                              ? `+Rp${item.trx_amount.toLocaleString()}`
                              : `-Rp${Math.abs(item.trx_amount).toLocaleString()}`}
                          </span>
                          <button className="split-btn" onClick={() => setShowSplitModal(true)}>
                            Split bill?
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="no-data">No transactions available for {selectedMonth}</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {showSplitModal && (
        <SplitBillForm
          onClose={() => setShowSplitModal(false)}
          transaction={{
            id: "TRX001",
            date: "31 May 2025",
            detail: "Warung Kak Udin",
            amount: "Rp25.000",
          }}
        />
      )}
    </div>
  );
}