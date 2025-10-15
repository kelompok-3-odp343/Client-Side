import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/SavingStyle.css";
import { Download } from "lucide-react";
import savingsIcon from "../assets/images/savings-icon.png";

export default function SavingsDashboard() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [savingsData, setSavingsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  /** ---------- DUMMY DATA ---------- **/
  const dummySavings = {
    totalBalance: 30000000,
    totalCount: 2,
    savings: [
      { id: 1, title: "Taplus Pegawai BNI", norekening: 1234567899, balance: 7000000 },
      { id: 2, title: "Taplus Bisnis", norekening: 9876543211, balance: 20000000 },
    ],
  };

  const dummyTransactions = [
    { date: "31 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "QRIS", amount: "-Rp15.000" },
    { date: "31 May 2025", month: "May", type: "Taplus Bisnis", detail: "Transfer", amount: "+Rp7.000.000" },
    { date: "30 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "Biaya Administrasi", amount: "-Rp3.500" },
    { date: "2 June 2025", month: "June", type: "Taplus Bisnis", detail: "Transfer", amount: "-Rp5.000.000" },
  ];

  /** ---------- FUNCTION: FETCH DATA FROM BACKEND ---------- **/
  const fetchSavingsData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/savings"); // contoh endpoint backend
      if (!response.ok) throw new Error("Failed to fetch savings data");
      const data = await response.json();
      setSavingsData(data);
    } catch (error) {
      console.warn("⚠️ Backend not available, using dummy savings data:", error.message);
      setSavingsData(dummySavings);
    }
  };

  const fetchTransactions = async (month) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transactions?month=${month}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.warn(`⚠️ Backend not available, using dummy transactions for ${month}:`, error.message);
      const filtered = dummyTransactions.filter((tx) => tx.month === month);
      setTransactions(filtered);
    }
  };

  /** ---------- USE EFFECT ---------- **/
  useEffect(() => {
    fetchSavingsData();
  }, []);

  useEffect(() => {
    fetchTransactions(selectedMonth);
  }, [selectedMonth]);

  /** ---------- GROUP TRANSACTIONS BY DATE ---------- **/
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
                Rp{(savingsData?.totalBalance || 0).toLocaleString()}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {savingsData?.totalCount || 0} Account Numbers
              </p>
            </div>
          </div>

          <h3 className="your-savings-title">Your Savings Accounts</h3>
          <div className="savings-grid">
            {savingsData?.savings?.map((s) => (
              <SavingsCard key={s.id} {...s} />
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

/* Savings Card */
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
