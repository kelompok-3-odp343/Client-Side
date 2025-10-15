import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Deposit.css";
import { Download } from "lucide-react";
import depositIcon from "../../assets/images/deposit-icon.png";
import { fetchDeposits, fetchDepositTransactions } from "../../data/deposit";

export default function Deposits() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId") || "dummyUser123"; // ← pindah ke sini
        const deposits = await fetchDeposits(userId);
        const tx = await fetchDepositTransactions(userId, selectedMonth);
        setDepositsData(deposits);
        setTransactions(tx);
      } catch (err) {
        console.error("Deposit data fetch failed:", err);
        setDepositsData({ totalBalance: 0, totalCount: 0, deposits: [] });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth]);

  if (loading) return <div className="loading">Loading deposits...</div>;

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
                Rp{depositsData?.totalBalance.toLocaleString()}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {depositsData?.totalCount} Time Deposits
              </p>
            </div>
          </div>

          <h3 className="your-deposit-title">Your Time Deposits</h3>
          <div className="deposit-grid">
            {depositsData?.deposits?.length > 0 ? (
              depositsData.deposits.map((d) => (
                <DepositCard key={d.id} {...d} />
              ))
            ) : (
              <p>No deposit accounts found.</p>
            )}
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
                      <p className="tx-amount">{tx.amount}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="no-tx">
                No transactions available for {selectedMonth}
              </p>
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