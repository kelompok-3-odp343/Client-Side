import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Savings.css";
import { Download } from "lucide-react";
import savingsIcon from "../../assets/images/savings-icon.png";
import { fetchSavings, fetchSavingsTransactions } from "../../data/savings";

export default function SavingsDashboard() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [savingsData, setSavingsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id || "USR001";

      const savings = await fetchSavings(userId);
      const tx = await fetchSavingsTransactions(userId, selectedMonth);

      setSavingsData(savings);
      setTransactions(tx);
    };
    loadData();
  }, [selectedMonth]);

  // Group transaksi berdasarkan tanggal
  const groupedTransactions = transactions.reduce((acc, tx) => {
    acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
    return acc;
  }, {});

  return (
    <div className="savings-page">
      <Navbar />

      <main className="savings-container">
        {/* LEFT PANEL */}
        <section className="savings-left">
          <div className="section-header">
            <h2 className="lg-title">Savings Information</h2>
            <p className="lg-sub">Track your transaction history and payment information</p>
          </div>

          <div className="savings-summary-card fancy">
            <div className="savings-summary-left">
              <div className="savings-icon-circle">
                <img src={savingsIcon} alt="Savings Icon" />
              </div>
            </div>
            <div className="savings-summary-right">
              <h3 className="summary-title">Your Savings</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">
                Rp{savingsData?.totalBalance.toLocaleString()}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {savingsData?.totalCount} Account Numbers
              </p>
            </div>
          </div>

          <h3 className="your-savings-title">Your Savings Accounts</h3>
          <div className="savings-grid">
            {savingsData?.deposits?.map((d) => (
              <SavingsCard key={d.id} {...d} />
            ))}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="savings-right">
          <div className="transaction-header">
            <h2 className="lg-title">Transaction History</h2>
            <Download className="download-icon" />
          </div>

          <div className="months">
            {months.map((m) => (
              <button
                key={m}
                className={`month-btn ${selectedMonth === m ? "active" : ""}`}
                onClick={() => setSelectedMonth(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="transaction-list">
            {transactions.length > 0 ? (
              Object.keys(groupedTransactions).map((date) => (
                <div key={date} className="transaction-group">
                  <p className="transaction-date"><strong>{date}</strong></p>
                  <hr />
                  {groupedTransactions[date].map((tx, i) => (
                    <div key={i} className="transaction-item">
                      <div className="tx-left">
                        <div className="tx-icon">★</div>
                        <div className="tx-text">
                          <p className="tx-type">{tx.type}</p>
                          <p className="tx-detail">{tx.detail}</p>
                        </div>
                      </div>
                      <div className={`tx-amount ${tx.amount.startsWith("-") ? "neg" : "pos"}`}>
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="no-tx">No transactions available for {selectedMonth}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ====== SAVINGS CARD COMPONENT ====== */
function SavingsCard({ title, norekening, balance }) {
  return (
    <div className="savings-card">
      <h4 className="savings-title">{title}</h4>
      <p className="savings-number">{norekening}</p>
      <p className="savings-balance">
        Effective balance: <strong>Rp{balance.toLocaleString()}</strong>
      </p>
    </div>
  );
}