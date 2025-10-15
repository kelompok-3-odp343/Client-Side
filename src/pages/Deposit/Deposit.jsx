import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Deposit.css";
import { Download } from "lucide-react";
import depositIcon from "../../assets/images/deposit-icon.png";
import { fetchDeposits, fetchDepositTransactions } from "../../data/deposit";

export default function DepositsDashboard() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [depositData, setDepositData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || "USR001";

    const loadDeposits = async () => {
      const res = await fetchDeposits(userId);
      setDepositData(res.data);
    };

    const loadTransactions = async () => {
      const res = await fetchDepositTransactions(userId, selectedMonth);
      setTransactions(res.data);
    };

    loadDeposits();
    loadTransactions();
  }, [selectedMonth]);

  const groupedTransactions = transactions.reduce((acc, tx) => {
    acc[tx.trx_date] = acc[tx.trx_date] ? [...acc[tx.trx_date], tx] : [tx];
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

          {depositData && (
            <div className="deposit-summary-card fancy">
              <div className="deposit-summary-left">
                <div className="deposit-icon-circle">
                  <img src={depositIcon} alt="Deposit Icon" />
                </div>
              </div>
              <div className="deposit-summary-right">
                <h3 className="summary-title">{depositData.title}</h3>
                <p className="summary-label">Total Balance</p>
                <p className="summary-balance">
                  Rp{depositData.total_balance.toLocaleString()}
                </p>
                <div className="summary-divider" />
                <p className="summary-sub">
                  You have {depositData.count_accounts} Time Deposits
                </p>
              </div>
            </div>
          )}

          <h3 className="your-deposit-title">Your Time Deposits</h3>
          <div className="deposit-grid">
            {depositData?.items?.map((d) => (
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
                          <p className="tx-type">{tx.trx_type}</p>
                          <p className="tx-detail">{tx.trx_note}</p>
                        </div>
                      </div>
                      <p className="tx-amount">
                        {Number(tx.trx_amount).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
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
function DepositCard({
  sub_cat,
  balance,
  maturity_date,
  interest_rate,
  created_time,
  tenor_months,
}) {
  const maturity = new Date(maturity_date);
  const open = new Date(created_time);

  return (
    <div className="deposit-card">
      <h4 className="deposit-title">{sub_cat}</h4>
      <p className="deposit-balance">
        Balance: Rp{balance.toLocaleString()}
      </p>

      <div className="circle-container">
        <div className="circle-ring">
          <div className="circle-inner">
            <span className="day">{maturity.getDate()}</span>
            <span className="month">
              {maturity.toLocaleString("default", { month: "short" })}
            </span>
            <span className="year">{maturity.getFullYear()}</span>
          </div>
        </div>
      </div>

      <hr />
      <div className="deposit-info">
        <p><span>Interest</span><span>{interest_rate}%</span></p>
        <p><span>Opening date</span><span>{open.toLocaleDateString()}</span></p>
        <p><span>Period</span><span>{tenor_months} months</span></p>
      </div>
    </div>
  );
}