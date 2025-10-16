import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import "../styles/pension-funds.css"; 
import { Download } from "lucide-react";
import pensionfunds from "../../../assets/images/pension.png"; 
import { getPensionFunds } from '../api/pension-funds.api';

export default function PensionFunds() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct",
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [pensionFundsData, setPensionFundsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const pension = async () => {
    try {
      const userId = "USR001";
      const response = await getPensionFunds(userId);

      const funds = Array.isArray(response.data) ? response.data : [];

      const totalBalance = funds.reduce(
        (sum, f) => sum + f.total_balance,
        0
      );

      const pensionFunds = funds.flatMap((f, index) =>
        f.items.map((item) => ({
          id: index + 1,
          title: f.title,
          accountNumber: item.deposit_account_number,
          balance: item.balance,
          growth: index % 2 === 0 ? "+0.6%" : "+0.4%",
        }))
      );

      setPensionFundsData({
        totalBalance,
        totalCount: pensionFunds.length,
        pensionFunds,
      });
    } catch (error) {
      console.error("error", error);
    }
  }

  const dummyTransactions = [
    { date: "31 May 2025", month: "May", type: "Simponi Likuid", detail: "Admin fee", amount: "-Rp1.000" },
    { date: "31 May 2025", month: "May", type: "Simponi Likuid Syariah", detail: "Management fee", amount: "-Rp7" },
    { date: "30 May 2025", month: "May", type: "Simponi Likuid Syariah", detail: "Pension Fund Contribution", amount: "-Rp3.500" },
  ];

  useEffect(() => {
    pension();
    // Filter transaksi sesuai bulan yang dipilih
    const filtered = dummyTransactions.filter((tx) => tx.month === selectedMonth);
    setTransactions(filtered);
  }, [selectedMonth]);

  // Group transaksi berdasarkan tanggal
  const groupedTransactions = transactions.reduce((acc, tx) => {
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
                <img src={pensionfunds} alt="Pension Fund Icon" />
              </div>
            </div>
            <div className="pension-fund-summary-right">
              <h3 className="summary-title">Total Pension Funds</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">Rp{pensionFundsData?.totalBalance.toLocaleString()}</p>
              <div className="summary-divider" />
              <p className="summary-sub">You have {pensionFundsData?.totalCount} Pension Funds</p>
            </div>
          </div>

          <h3 className="your-pension-title">Your Account Numbers</h3>
          <div className="account-number-grid">
            {pensionFundsData?.pensionFunds?.map((d) => (
              <div key={d.id} className="account-number-column">
                <AccountNumberCard {...d} />
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

/* Account Number Card */
function AccountNumberCard({ title, accountNumber, balance, growth }) {
  return (
    <div className="account-number-card">
      <div className="account-number-header">
        <p className="account-title">{title}</p>
        <p className="account-number">{accountNumber}</p>
      </div>
      <hr />
      <div className="account-balance">
        <p><span>Accumulated Balance</span><span>Rp{balance.toLocaleString()}</span></p>
        <p><span>Growth</span><span>{growth}</span></p>
      </div>
    </div>
  );
}
