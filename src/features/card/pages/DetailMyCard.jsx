import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye, RefreshCw } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { useNavigate, useLocation } from "react-router-dom";

export default function DetailMyCard() {
  const getLastMonths = () => {
    const now = new Date();
    const currentYear = 2025; 
    
    const arr = [];
    for (let i = 0; i < 12; i++) {
      let m = now.getMonth() - i;
      let y = currentYear;
      
      while (m < 0) {
        m += 12;
        y -= 1;
      }

      const d = new Date(y, m, 1);
      arr.push({
        label: d.toLocaleString("en-US", { month: "short" }),
        month: m + 1,
        year: y,
      });
    }
    return arr.reverse();
  };

  const mapTransactionsToGroups = (flat) => {
    if (!Array.isArray(flat)) return [];

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
        transactionType: trx.transactionType,
        type: trx.transactionType,
        detail: trx.partyName,
        partyName: trx.partyName,
        partyDetail: trx.partyDetail,
        amount: (trx.debitCredit === "C" ? "+" : "-") + trx.amount,
        debit_credit: trx.debitCredit,
        jenisTransaksi: trx.debitCredit === "D" ? "Pengeluaran" : "Pemasukan",
        split_bill_id: trx.splitBillId ?? null,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showBalance, setShowBalance] = useState(true); 
  const [months] = useState(getLastMonths());
  
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    const initCards = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        let initialCards = [];

        if (location.state?.cards && Array.isArray(location.state.cards) && location.state.cards.length > 0) {
          initialCards = location.state.cards;
        } else {
          const response = await fetchAllCards();
          if (Array.isArray(response) && response.length > 0) {
            initialCards = response;
          } else {
            throw new Error("No cards found");
          }
        }

        setCards(initialCards);
        const targetCard = location.state?.selectedAccount 
          ? initialCards.find(c => c.account_number === location.state.selectedAccount)
          : initialCards[0];
          
        setSelectedCard(targetCard || initialCards[0]);
      } catch (err) {
        console.error("Error loading cards:", err);
        setErrorMsg(err.message || "Failed to load card information");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    initCards();
  }, [location.state]);

  useEffect(() => {
    if (!selectedCard) return;
    
    setTransactions([]); 

    const targetMonth = selectedMonth || months[months.length - 1];
    if (selectedMonth !== targetMonth) {
        setSelectedMonth(targetMonth);
    }
    
    handleSelectedMonth(targetMonth, selectedCard);
  }, [selectedCard]);

  useEffect(() => {
    const flatItems = transactions.flatMap((g) => g.items || []);
    const income = flatItems
      .filter((i) => typeof i.amount === "string" && i.amount.startsWith("+"))
      .reduce((s, i) => s + Number((i.amount || "").replace(/[^\d]/g, "")), 0);
    const expense = flatItems
      .filter((i) => typeof i.amount === "string" && i.amount.startsWith("-"))
      .reduce((s, i) => s + Number((i.amount || "").replace(/[^\d]/g, "")), 0);
    setChartData({ income, expense });
  }, [transactions]);

  const handleChangeCard = (accountNumber) => {
    const found = cards.find((c) => c.account_number === accountNumber);
    if (found) {
      setSelectedCard(found);
    }
  };

  const handleSelectedMonth = async (m, forcedCard) => {
    const card = forcedCard || selectedCard;
    if (!card) return;

    setSelectedMonth(m);

    try {
      const data = await fetchTransactionHistory({
        month: m.month,
        year: m.year,
        accountNumber: card.account_number,
      });

      if (data?.transactions && data.transactions.length > 0) {
        const grouped = mapTransactionsToGroups(data.transactions);
        setTransactions(grouped);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedTransaction(item);
    setShowDetailModal(true);
  };

  const handleDownloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to download");
      return;
    }
    const csvData = [];
    csvData.push(["Date", "Transaction Type", "Description", "Amount", "Type", "Split Bill Status"]);
    transactions.forEach((group) => {
      group.items.forEach((item) => {
        const type = item.debit_credit === "C" ? "Credit" : "Debit";
        const amount = item.amount.replace(/[^\d]/g, "");
        const splitStatus = item.split_bill_id ? "Split Bill Created" : "-";
        csvData.push([item.transactionDate, item.type, item.detail, amount, type, splitStatus]);
      });
    });
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Savings_Transactions_${selectedCard?.account_number}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="detail-mycard">
        <Navbar />
        <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ marginBottom: '1rem' }}></div>
            <p>Loading card details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (errorMsg || !selectedCard) {
    return (
      <div className="detail-mycard">
        <Navbar />
        <main className="main" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2>Unable to Load Cards</h2>
          <p style={{ color: "#777", margin: "1rem 0" }}>
            {errorMsg || "No card information available"}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: "0.5rem 1rem", 
              background: "#6dddd0", 
              border: "none", 
              borderRadius: "0.375rem", 
              color: "white", 
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <RefreshCw size={16} /> Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="main">
        <section className="left-panel">
          <div className="account-details">
            <div className="account-details-dropdown">
              <h2><strong>Account Details</strong></h2>
              <select
                value={selectedCard?.account_number}
                onChange={(e) => handleChangeCard(e.target.value)}
              >
                {cards.map((c) => (
                  <option key={c.account_number} value={c.account_number}>
                    {c.type} - {c.account_number}
                  </option>
                ))}
              </select>
            </div>

            <p className="subtext">Track your transaction history and payment information</p>

            <div className="account-card">
              <p className="card-bank-name">{selectedCard?.type}</p>

              <p className="card-number-row">
                {selectedCard?.account_number 
                  ? String(selectedCard.account_number).replace(/(.{4})/g, "$1 ").trim() 
                  : ""}
              </p>
              
              <div className="card-balance-section">
                <p className="balance-title">Effective Balance</p>
                <div className="balance-value-row">
                  <p className="card-balance-large">
                    {showBalance
                      ? `Rp${Number(selectedCard?.effective_balance || 0).toLocaleString("id-ID")}`
                      : "•••••••••"}
                  </p>
                  <span className="eye-icon" onClick={() => setShowBalance(!showBalance)}>
                    {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
                  </span>
                </div>
              </div>
            </div>

            <div className="warning-box">
              ⚠️ Do not share card number, expiration date, or CVV/CVC code with anyone.
            </div>
          </div>

          <h5>Earnings Overview</h5>
          <div className="earnings">
            <div className="numbers">
              <div>
                <h3>Rp{chartData.income.toLocaleString("id-ID")}</h3>
                <p><strong>Income</strong></p>
              </div>
              <div>
                <h3>Rp{chartData.expense.toLocaleString("id-ID")}</h3>
                <p><strong>Expenses</strong></p>
              </div>
            </div>

            <p className="difference">
              <strong>
                A difference of Rp {(chartData.income - chartData.expense).toLocaleString("id-ID")}
              </strong>
            </p>

            <div className="bar-chart">
              <div className="bar income-bar" style={{ height: `${chartData.income ? Math.max(10, (chartData.income / Math.max(chartData.income, chartData.expense || 1)) * 100) : 8}%` }} />
              <div className="bar expense-bar" style={{ height: `${chartData.expense ? Math.max(6, (chartData.expense / Math.max(chartData.income || 1, chartData.expense)) * 100) : 6}%` }} />
            </div>
          </div>
        </section>

        <section className="right-panel">
          <TransactionHistory
            transactions={transactions}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={handleSelectedMonth}
            themeColor="#ffa96b"
            title="Transaction History"
            onTransactionClick={handleOpenDetail}
            productType="SAV"
            showDownloadButton={true}
            onDownload={handleDownloadCSV}
            emptyMessage="No transactions available"
          />
        </section>
      </main>

      {(showSplitModal || showDetailModal) && (
        <div className="modal-overlay">
          {showDetailModal && selectedTransaction && (
            <TransactionDetailModal
              transaction={selectedTransaction}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedTransaction(null);
              }}
              onSplitBill={(trx) => {
                setShowDetailModal(false);
                setShowSplitModal(true);
                setSelectedTransaction({
                  transactionId: trx.transactionId,
                  date: trx.transactionDate,
                  detail: trx.detail,
                  amount: trx.amount,
                  account_id: selectedCard.account_id,
                  accountNumber: selectedCard.account_number,
                  transactionDate: trx.transactionDate,
                });
              }}
              productType="SAV"
            />
          )}

          {showSplitModal && selectedTransaction && (
            <SplitBillForm
              transaction={selectedTransaction}
              onClose={() => {
                setShowSplitModal(false);
                setSelectedTransaction(null);
              }}
              onSuccess={(newSplitBillId, action) => {
                setTransactions((prev) =>
                  prev.map((group) => ({
                    ...group,
                    items: group.items.map((t) =>
                      t.transactionId === selectedTransaction.transactionId
                        ? { ...t, split_bill_id: newSplitBillId }
                        : t
                    ),
                  }))
                );
                const updated = { ...(selectedTransaction || {}), split_bill_id: newSplitBillId };
                setSelectedTransaction(updated);
                setShowSplitModal(false);
                if (action === "view") {
                  navigate(`/splitbill/detail`, { state: { splitBillId: newSplitBillId, color: "#6dddd0" } });
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}