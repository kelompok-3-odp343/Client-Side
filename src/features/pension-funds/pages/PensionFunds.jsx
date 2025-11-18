import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/pension-funds.css";
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
  const [selectedMonth, setSelectedMonth] = useState(
    getLastMonths()[getLastMonths().length - 1]
  );

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

const handleDownloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to download");
      return;
    }

    // Prepare CSV data
    const csvData = [];
    csvData.push(["Date", "Transaction Type", "Description", "Amount", "Type"]);

    transactions.forEach((group) => {
      group.items.forEach((item) => {
        const type = item.debit_credit === "C" ? "Credit" : "Debit";
        const amount = item.amount.replace(/[^\d]/g, "");
        csvData.push([
          item.transactionDate,
          item.type,
          item.detail,
          amount,
          type,
        ]);
      });
    });

    // Convert to CSV string
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `DPLK_Transactions_${selectedMonth?.label}_${selectedMonth?.year}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const data = await fetchDPLKTransactionHistory({
      month: m.month,
      year: m.year,
      accountNumber: selectedAccount || "",
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
          <TransactionHistory
            transactions={transactions}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            themeColor="#FFBC8E"
            title="Transaction History"
            onTransactionClick={(item) => {
              setSelectedTransaction(item);
              setShowDetailModal(true);
            }}
            productType="DPLK"
            showDownloadButton={true}
            onDownload={handleDownloadCSV}
            emptyMessage="No transactions available"
          />
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
          <span>
            <strong>Rp{balance.toLocaleString()}</strong>
          </span>
        </p>

        <p>
          <span>Growth</span>
          <span
            style={{
              color: growth > 0 ? "#3DBF4A" : growth < 0 ? "#F94449" : "#000",
            }}
          >
            <strong>
              ({growth > 0 ? "+" : ""}
              {(growth * 100).toFixed(2)}%)
            </strong>
          </span>
        </p>
      </div>
    </div>
  );
}