import { useEffect, useState } from "react";
import { Download, Bell, User, Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import "../css/DepositStyle.css";

export default function DepositsDashboard() {
  const months = [
    "May", "June", "July", "Aug", "Sept", "Oct", 
    "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  const [selectedMonth, setSelectedMonth] = useState("May");
  const [transactions, setTransactions] = useState([]);
  const [depositsData, setDepositsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  /** Dummy data (akan diganti Spring Boot) */
  const dummyTransactions = [
    { date: "31 May 2025", month: "May", type: "Long Term", detail: "Admin fee", amount: -1000 },
    { date: "31 May 2025", month: "May", type: "Short Term", detail: "Management fee", amount: -7 },
    { date: "30 May 2025", month: "May", type: "Short Term", detail: "Deposits", amount: -3500 },
    { date: "02 June 2025", month: "June", type: "Long Term", detail: "Deposits", amount: -2000 },
    { date: "05 June 2025", month: "June", type: "Short Term", detail: "Admin fee", amount: -500 },
  ];

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

  /** Fetch deposit data */
  async function fetchDepositsFromBackend() {
    try {
      const res = await fetch("http://localhost:8080/api/deposits");
      if (!res.ok) throw new Error("Network error");
      return await res.json();
    } catch {
      console.warn("Backend belum aktif, pakai dummy deposit data");
      return dummyDeposits;
    }
  }

  /** Fetch transactions data */
  async function fetchTransactionsFromBackend(month) {
    try {
      const res = await fetch(`http://localhost:8080/api/transactions?month=${month}`);
      if (!res.ok) throw new Error("Network error");
      return await res.json();
    } catch {
      console.warn("Backend belum aktif, pakai dummy transaction data");
      return dummyTransactions.filter((tx) => tx.month === month);
    }
  }

  /** Load data dari backend */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const txData = await fetchTransactionsFromBackend(selectedMonth);
      const depData = await fetchDepositsFromBackend();
      setTransactions(txData);
      setDepositsData(depData);
      setLoading(false);
    };
    loadData();
  }, [selectedMonth]);

  const grouped = transactions.reduce((acc, tx) => {
    acc[tx.date] = acc[tx.date] ? [...acc[tx.date], tx] : [tx];
    return acc;
  }, {});

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
      <div className="login-box fade-in">
        <div className="logo">
          <FontAwesomeIcon icon={faDoorOpen} className="logo-icon" />
          <h1>
            wand<span className="o1">o</span>
            <span className="o2">o</span>r
          </h1>
        </div>
      </div>
      <div className="header-icons">
        <Bell size={20} />
        <User size={20} />
      </div>
      </header>


      {/* MAIN */}
      <main className="main">
        {/* LEFT SECTION */}
        <section className="left">
          <h2>Deposits Information</h2>
          <p className="subtitle">Lock the Rate, Unlock the Growth</p>

          {/* BALANCE CARD */}
          <div className="balance-card">
            <div className="balance-icon">
              <img src="/deposit-icon.png" alt="Deposit Icon" />
            </div>
            <div className="balance-info">
              <div className="balance-header">
                <h3>Time Deposits</h3>
                <button 
                  className="toggle-btn"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <p className="small-text">Total Balance</p>
              <p className="balance-amount">
                {showBalance 
                  ? `Rp${depositsData ? depositsData.totalBalance.toLocaleString() : "0"}`
                  : "••••••••"}
              </p>
              <p className="small-text">
                You have {depositsData ? depositsData.totalCount : 0} Time Deposits
              </p>
            </div>
          </div>

          {/* YOUR DEPOSITS */}
          <h3 className="your-deposit-title">Your Time Deposits</h3>
          <div className="deposit-grid">
            {depositsData?.deposits?.map((dep) => (
              <DepositCard
                key={dep.id}
                title={dep.title}
                balance={`Rp${dep.balance.toLocaleString()}`}
                date={dep.date}
                interest={dep.interest}
                opening={dep.opening}
                period={dep.period}
              />
            ))}
          </div>
        </section>

        {/* RIGHT SECTION */}
        <section className="right">
          <div className="transaction-header">
            <h2>Transaction History</h2>
            <Download size={20} className="download-icon" />
          </div>

          <div className="months">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`month-btn ${selectedMonth === month ? "active" : ""}`}
              >
                {month}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="no-tx">Loading...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="no-tx">No transactions for {selectedMonth}</p>
          ) : (
            <div className="transaction-list fade-in">
              {Object.keys(grouped).map((date) => (
                <div key={date} className="transaction-date">
                  <h4>{date}</h4>
                  {grouped[date].map((tx, i) => (
                    <div key={i} className="transaction-item">
                      <div className="tx-left">
                        <div className="tx-icon">★</div>
                        <div>
                          <p className="tx-type">{tx.type}</p>
                          <p className="tx-detail">{tx.detail}</p>
                        </div>
                      </div>
                      <p className="tx-amount">-Rp{Math.abs(tx.amount).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/** Deposit Card (NEW DESIGN) */
function DepositCard({ title, balance, date, interest, opening, period }) {
  const [day, month, year] = date.split(" ");

  return (
    <div className="deposit-card-new">
      <h4 className="deposit-title">{title}</h4>
      <p className="deposit-balance-label">Balance:</p>
      <p className="deposit-balance-amount">{balance}</p>

      {/* Circular date */}
      <div className="circle-container">
        <div className="circle-ring">
          <div className="circle-inner-text">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
            <span className="year">{year}</span>
          </div>
        </div>
      </div>

      <hr className="deposit-divider" />

      <div className="deposit-info">
        <p>
          <span>Interest</span>
          <span>{interest}</span>
        </p>
        <p>
          <span>Opening date</span>
          <span>{opening}</span>
        </p>
        <p>
          <span>Period</span>
          <span>{period}</span>
        </p>
      </div>
    </div>
  );
}

