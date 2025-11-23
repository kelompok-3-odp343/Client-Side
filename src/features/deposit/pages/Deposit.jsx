import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/deposit.css";
import depositIcon from "../../../assets/images/deposit-icon.png";
import { getTimeDeposits, getTimeDepositTransactions } from "../api/time-deposits.api";

export default function Deposits() {
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(
    getLastMonths()[getLastMonths().length - 1]
  );

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);

      const responseData = await getTimeDeposits();
      const resApi = responseData.data;

      const items = Array.isArray(resApi.items) ? resApi.items : [];

      const formattedData = {
        totalBalance: resApi.totalBalance,
        totalCount: resApi.countAccounts,
        deposits: items.map((item) => ({
          id: item.itemId,
          title: `Account ${item.depositAccountNumber}`,
          balance: item.balance,
          interest: `${item.interestRate}%`,
          opening: new Date(item.maturityDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          period: `${item.tenorMonths} months`,
          date: new Date(item.maturityDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: item.status,
          account_number: item.depositAccountNumber,
        })),
      };

      setDepositsData(formattedData);
    } catch (err) {
      console.error("Error loading deposits:", err);
      setError(err.message || "Failed to load deposit information");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedMonth = async (m) => {
    setSelectedMonth(m);
    setLoading(true);

    try {
      const accountNumber = depositsData?.deposits?.[0]?.account_number;

      const data = await getTimeDepositTransactions({
        month: m.month,
        year: m.year,
        accountNumber: accountNumber || "",
      });

      if (!data?.transactions) {
        setTransactions([]);
        return;
      }

      const grouped = mapTransactionsToGroups(data.transactions);
      setTransactions(grouped);
    } catch (err) {
      console.error("Error loading deposit transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to download");
      return;
    }
    const csvData = [];
    csvData.push(["Date", "Transaction Type", "Description", "Amount", "Type"]);
    transactions.forEach((group) => {
      group.items.forEach((item) => {
        const type = item.debit_credit === "C" ? "Credit" : "Debit";
        const amount = String(item.amount).replace(/[^\d]/g, "");
        csvData.push([item.transactionDate, item.type, item.detail, amount, type]);
      });
    });
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Time_Deposits_Transactions_${selectedMonth?.label}_${selectedMonth?.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mapTransactionsToGroups = (flat) => {
    const groups = {};
    flat.forEach((trx) => {
      let d;
      try {
        const dateStr = trx.transactionDate;
        if (!dateStr) return;
        d = new Date(dateStr);
        if (isNaN(d.getTime())) return;
      } catch (e) {
        return;
      }

      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      groups[key].items.push({
        transactionId: trx.transactionId,
        transactionDate: trx.transactionDate,
        type: trx.transactionType,
        detail: trx.partyName,
        amount: (trx.debitCredit === "C" ? "+" : "-") + trx.amount,
        jenisTransaksi: trx.debitCredit === "D" ? "Pengeluaran" : "Pemasukan",
        debit_credit: trx.debitCredit,
        partyName: trx.partyName,
        partyDetail: trx.partyDetail,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map((g) => ({
        ...g,
        key: String(g.sortKey),
      }));

  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    if (depositsData?.deposits?.length) {
      handleSelectedMonth(selectedMonth);
    }
  }, [depositsData]);

  if (error) {
    return (
      <div className="deposit-page">
        <Navbar />
        <main className="deposit-container" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2>Unable to Load Deposits</h2>
          <p style={{ color: "#777", margin: "1rem 0" }}>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </main>
      </div>
    );
  }

  return (
    <div className="deposit-page">
      <Navbar />

      <main className="deposit-container">
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
                {depositsData ? `Rp${depositsData.totalBalance?.toLocaleString()}` : 'Loading...'}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {depositsData?.totalCount || 0} Time Deposits
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
              <div className="no-deposit-message">
                No time deposits available
              </div>
            )}
          </div>
        </section>

        <section className="deposit-right">
          <TransactionHistory
            transactions={transactions}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={handleSelectedMonth}
            themeColor="#FFE8B0"
            title="Transaction History"
            loading={loading}
            onTransactionClick={(item) => {
              setSelectedTransaction(item);
              setShowDetailModal(true);
            }}
            productType="DEP"
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
          productType="DEP"
        />
      )}
    </div>
  );
}

function DepositCard({ title, balance, date, interest, opening, period }) {
  const [day, month, year] = date.split(" ");
  return (
    <div className="deposit-card">
      <h4 className="deposit-title">{title}</h4>
      <p className="deposit-balance">
        Balance:<br />
        <strong>Rp{balance.toLocaleString()}</strong>
      </p>

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