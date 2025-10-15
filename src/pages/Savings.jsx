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
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Dummy data
  const dummyDeposits = {
    totalBalance: 30000000,
    totalCount: 2,
    deposits: [
      {
        id: 1,
        title: "Taplus Pegawai BNI",
        norekening: 1234567899,
        balance: 7000000,
      },
      {
        id: 2,
        title: "Taplus Bisnis",
        norekening: 9876543211,
        balance: 20000000,
      },
    ],
  };

  const dummyTransactions = [
    { date: "31 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "QRIS", amount: "-Rp15.000" },
    { date: "31 May 2025", month: "May", type: "Taplus Bisnis", detail: "Transfer", amount: "+Rp7.000.000" },
    { date: "30 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "Biaya Administrasi", amount: "-Rp3.500" },
    { date: "2 June 2025", month: "June", type: "Taplus Bisnis", detail: "Transfer", amount: "-Rp5.000.000" },
  ];

  useEffect(() => {
    setDepositsData(dummyDeposits);
    // Filter transaksi sesuai bulan yang diklik
    const filtered = dummyTransactions.filter((tx) => tx.month === selectedMonth);
    setTransactions(filtered);
  }, [selectedMonth]);

  // Group transaksi by date
  const groupedTransactions = transactions.reduce((acc, tx) => {
    acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
    return acc;
  }, {});

  return (
    <div className="deposit-page">
      <Navbar />

      <main className="deposit-container">
        {/* LEFT PANEL */}
        <section className="deposit-left">
          <div className="section-header">
            <h2 className="lg-title">Savings Information</h2>
            <p className="lg-sub">Track your transaction history and payment information</p>
          </div>

          <div className="deposit-summary-card fancy">
            <div className="deposit-summary-left">
              <div className="deposit-icon-circle">
                <img src={savingsIcon} alt="Savings Icon" />
              </div>
            </div>
            <div className="deposit-summary-right">
              <h3 className="summary-title">Your Savings</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">Rp{depositsData?.totalBalance.toLocaleString()}</p>
              <div className="summary-divider" />
              <p className="summary-sub">You have {depositsData?.totalCount} Account Numbers</p>
            </div>
          </div>

          <h3 className="your-deposit-title">Your Savings Accounts</h3>
          <div className="deposit-grid">
            {depositsData?.deposits?.map((d) => (
              <SavingsCard key={d.id} {...d} />
            ))}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="deposit-right">
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
      <div className="deposit-card">
        <h4 className="deposit-title">{title}</h4>
        <p className="deposit-number">{norekening}</p>
        <p className="deposit-balance">
          Effective balance: <strong>Rp{balance.toLocaleString()}</strong>
        </p>
      </div>
    );
  }