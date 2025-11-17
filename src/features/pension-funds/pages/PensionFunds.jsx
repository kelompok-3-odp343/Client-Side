import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import "../styles/pension-funds.css";
import { Download } from "lucide-react";
import pensionfunds from "../../../assets/images/Pension.png";
import { getPensionFunds, fetchDPLKTransactionHistory } from "../api/pension-funds.api";

const getLastMonths = () => {
  const now = new Date();
  const arr = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }
  return arr.reverse();
};

export default function PensionFunds() {
  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(getLastMonths()[getLastMonths().length - 1]);

  const [pensionFundsData, setPensionFundsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const pension = async () => {
    try {
      const response = await getPensionFunds();
      const funds = Array.isArray(response.data) ? response.data : [];

      const totalBalance = funds.reduce((sum, f) => sum + f.totalBalance, 0);

      const pensionFunds = funds.flatMap((f, index) =>
        f.items?.map((item) => ({
          id: `${index}-${item.fundId}`,
          title: f.title || "-",
          accountNumber: item.depositAccountNumber,
          balance: item.accumulatedBalance,
          growth: item.growth,
        })) || []
      );

      setPensionFundsData({
        totalBalance,
        totalCount: pensionFunds.length,
        pensionFunds,
      });

      if (pensionFunds.length) {
        setSelectedAccount(pensionFunds[0].accountNumber);
      }

    } catch (error) {
      console.error("error", error);
      setPensionFundsData({
        totalBalance: 0,
        totalCount: 0,
        pensionFunds: [],
      });
    }
  };

  const mapDPLKTransactions = (list) => {
    const groups = {};

    list.forEach((tx) => {
      const d = new Date(tx.transactionDate);
      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      const prefix = tx.debit_credit === "C" ? "+" : "-";

      groups[key].items.push({
        transactionId: tx.transactionId,
        transactionDate: tx.transactionDate,
        type: tx.transactionType || "-",
        detail: tx.description || tx.partyName || "-",
        amount: prefix + tx.amount,
        debit_credit: tx.debit_credit,
        partyName: tx.transactionType || tx.partyName,
        partyDetail: tx.description || tx.partyName,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  const fetchDPLKTransactionsForMonth = async (m) => {
    if (!selectedAccount) return;

    const data = await fetchDPLKTransactionHistory({
      month: m.month,
      year: m.year,
      accountNumber: selectedAccount,
    });

    const list = data.transactions || data.transaction || [];

    if (!list.length) {
      setTransactions([]);
      return;
    }

    const grouped = mapDPLKTransactions(list);
    setTransactions(grouped);
  };

  useEffect(() => {
    pension();
  }, []);

  useEffect(() => {
    fetchDPLKTransactionsForMonth(selectedMonth);
  }, [selectedMonth, selectedAccount]);

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

              <p className="summary-balance">
                Rp{(pensionFundsData?.totalBalance || 0).toLocaleString()}
              </p>

              <div className="summary-divider" />

              <p className="summary-sub">
                You have {pensionFundsData?.totalCount || 0} Pension Funds
              </p>
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
                key={m.month + "-" + m.year}
                className={`month-btn-dplk ${m.month === selectedMonth.month && m.year === selectedMonth.year ? "active" : ""
                  }`}
                onClick={() => setSelectedMonth(m)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((group) => (
                <div key={group.date} className="transaction-group">
                  <p className="transaction-date"><strong>{group.date}</strong></p>
                  <hr />
                  {group.items.map((tx, i) => (
                    <div
                      key={i}
                      className="transaction-item"
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setShowDetailModal(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="tx-left">
                        <div className="tx-icon">★</div>
                        <div className="tx-text">
                          <p className="tx-type">{tx.type}</p>
                          <p className="tx-detail">{tx.detail}</p>
                        </div>
                      </div>
                      <div
                        className={`tx-amount ${tx.amount.startsWith("-") ? "neg" : "pos"
                          }`}
                      >
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="no-tx">No transactions available for {selectedMonth.label}</p>
            )}
          </div>
        </section>
      </main>

      {showDetailModal && selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
          productType="DPLK"
        />
      )}
    </div>
  );
}

function AccountNumberCard({ title, accountNumber, balance, growth }) {
  return (
    <div className="account-number-card">
      <div className="account-number-header">
        <p className="account-title">{title}</p>
        <p className="account-number">{accountNumber}</p>
      </div>
      <hr />
      <div className="account-balance">
        <p>
          <span>Accumulated balance</span>
          <span><strong>Rp{balance.toLocaleString()}</strong></span>
        </p>

        <p>
          <span>Growth</span>
          <span style={{
            color:
              growth > 0 ? "#3DBF4A" :
                growth < 0 ? "#F94449" : "#000"
          }}>
            <strong>
              ({growth > 0 ? "+" : ""}{(growth * 100).toFixed(2)}%)
            </strong>
          </span>
        </p>
      </div>
    </div>
  );
}