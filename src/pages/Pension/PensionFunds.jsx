import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./PensionFunds.css";
import { Download } from "lucide-react";
import pensionIcon from "../../assets/images/pension.png";
import { fetchPensionFunds, fetchPensionTransactions } from "../../data/pension";

export default function PensionFunds() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [pensionData, setPensionData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || "USR001";

    const loadPension = async () => {
      const res = await fetchPensionFunds(userId);
      setPensionData(res.data);
    };

    const loadTransactions = async () => {
      const res = await fetchPensionTransactions(userId, selectedMonth);
      setTransactions(res.data);
    };

    loadPension();
    loadTransactions();
  }, [selectedMonth]);

  // Group transaksi berdasarkan tanggal
  const grouped = transactions.reduce((acc, tx) => {
    acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
    return acc;
  }, {});

  return (
    <div className="pension-fund-page">
      <Navbar />

      <main className="pension-fund-container">
        {/* LEFT PANEL */}
        <section className="pension-fund-left">
          <div className="section-header">
            <h2 className="lg-title">Pension Funds Information</h2>
            <p className="lg-sub">Secure Your Future with Pension Funds</p>
          </div>

          <div className="pension-fund-summary-card fancy">
            <div className="pension-fund-summary-left">
              <div className="pension-fund-icon-circle">
                <img src={pensionIcon} alt="Pension Fund Icon" />
              </div>
            </div>
            <div className="pension-fund-summary-right">
              <h3 className="summary-title">Total Pension Funds</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">
                Rp{pensionData?.total_balance.toLocaleString("id-ID")}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {pensionData?.total_accounts} Pension Funds
              </p>
            </div>
          </div>

          <h3 className="your-pension-title">Your Account Numbers</h3>
          <div className="account-number-grid">
            {pensionData?.items.map((acc) => (
              <div key={acc.id} className="account-number-column">
                <AccountNumberCard {...acc} />
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="pension-fund-right">
          <div className="transaction-header">
            <h4 className="lg-title">Transaction History</h4>
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
              Object.keys(grouped).map((date) => (
                <div key={date} className="transaction-group">
                  <p className="transaction-date">
                    <strong>{date}</strong>
                  </p>
                  <hr />
                  {grouped[date].map((tx, i) => (
                    <div key={i} className="transaction-item">
                      <div className="tx-left">
                        <div className="tx-icon">★</div>
                        <div className="tx-text">
                          <p className="tx-type">{tx.type}</p>
                          <p className="tx-detail">{tx.detail}</p>
                        </div>
                      </div>
                      <p
                        className="tx-amount"
                        style={{
                          color: tx.amount.startsWith("+") ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {tx.amount}
                      </p>
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

/* Card Component */
function AccountNumberCard({ title, account_number, balance, growth }) {
  return (
    <div className="account-number-card">
      <div className="account-number-header">
        <p className="account-title">{title}</p>
        <p className="account-number">{account_number}</p>
      </div>
      <hr />
      <div className="account-balance">
        <p>
          <span>Accumulated Balance</span>
          <span>Rp{balance.toLocaleString("id-ID")}</span>
        </p>
        <p>
          <span>Growth</span>
          <span>{growth}</span>
        </p>
      </div>
    </div>
  );
}