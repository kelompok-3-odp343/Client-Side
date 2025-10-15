import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/DepositStyle.css";
import { Download } from "lucide-react";
import depositIcon from "../assets/images/deposit-icon.png";

export default function Deposits() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Dummy data
  const dummyDeposits = {
    totalBalance: 5000000,
    totalCount: 2,
    deposits: [
      {
        id: 1,
        title: "Short Term",
        balance: 2000000,
        interest: "0.4%",
        opening: "28 October 2025",
        period: "3 months",
        date: "28 Nov 2025",
      },
      {
        id: 2,
        title: "Long Term",
        balance: 3000000,
        interest: "0.4%",
        opening: "28 October 2025",
        period: "3 months",
        date: "28 Nov 2025",
      },
    ],
  };

  const dummyTransactions = [
    { date: "31 May 2025", month: "May", type: "Long Term", detail: "Admin fee", amount: "-Rp1.000" },
    { date: "31 May 2025", month: "May", type: "Short Term", detail: "Management fee", amount: "-Rp7" },
    { date: "30 May 2025", month: "May", type: "Short Term", detail: "Deposits", amount: "-Rp3.500" },
  ];

  // Function ambil data
  const fetchDeposits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/deposits");
      if (!res.ok) throw new Error("Failed to fetch deposits");
      const data = await res.json();
      setDepositsData(data);
      console.log("✅ Data deposits diambil dari backend");
    } catch (error) {
      console.warn("⚠️ Backend tidak aktif, gunakan dummyDeposits");
      setDepositsData(dummyDeposits);
    }
  };

  const fetchTransactions = async (month) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions?month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
      console.log("✅ Data transactions diambil dari backend");
    } catch (error) {
      console.warn("⚠️ Backend tidak aktif, gunakan dummyTransactions");
      const filtered = dummyTransactions.filter((tx) => tx.month === month);
      setTransactions(filtered);
    }
  };

  // gunakan use effect
  useEffect(() => {
    fetchDeposits();
    fetchTransactions(selectedMonth);
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
            <h2 className="lg-title">Deposits Information</h2>
            <p className="lg-sub">Lock the Rate, Unlock the Growth</p>
          </div>

          <div className="deposit-summary-card fancy">
            <div className="deposit-summary-left">
              <div className="deposit-icon-circle">
                <img src={depositIcon} alt="Deposit Icon" />
              </div>
            </div>
            <div className="deposit-summary-right">
              <h3 className="summary-title">Time Deposits</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">
                Rp{depositsData?.totalBalance?.toLocaleString()}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {depositsData?.totalCount} Time Deposits
              </p>
            </div>
          </div>

          <h3 className="your-deposit-title">Your Time Deposits</h3>
          <div className="deposit-grid">
            {depositsData?.deposits?.map((d) => (
              <DepositCard key={d.id} {...d} />
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

/* Deposit Card */
function DepositCard({ title, balance, date, interest, opening, period }) {
  const [day, month, year] = date.split(" ");
  return (
    <div className="deposit-card">
      <h4 className="deposit-title">{title}</h4>
      <p className="deposit-balance">Balance: Rp{balance.toLocaleString()}</p>

      <div className="circle-container">
        <div className="circle-ring">
          <div className="circle-inner">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
            <span className="year">{year}</span>
          </div>
        </div>
      </div>

      <hr />
      <div className="deposit-info">
        <p><span>Interest</span><span>{interest}</span></p>
        <p><span>Opening date</span><span>{opening}</span></p>
        <p><span>Period</span><span>{period}</span></p>
      </div>
    </div>
  );
}
