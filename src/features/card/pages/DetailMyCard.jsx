import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye, RefreshCw } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { useNavigate, useLocation } from "react-router-dom";

// Import Dummy Data sebagai fallback
import { DUMMY_CARDS as dummyCards } from "../data/card.dummy"; 

export default function DetailMyCard() {
  // --- Helper Functions ---
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

  // --- State & Hooks ---
  const location = useLocation();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isUsingDummy, setIsUsingDummy] = useState(false); // Indikator pakai dummy

  const [showBalance, setShowBalance] = useState(true);
  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  // --- Effect: Init Data Cards ---
  useEffect(() => {
    const initCards = async () => {
      setLoading(true);
      setErrorMsg("");
      setIsUsingDummy(false);

      // Cek 1: Apakah data dikirim via navigasi? (Dari Dashboard/CardSection)
      if (location.state?.cards && Array.isArray(location.state.cards) && location.state.cards.length > 0) {
        setCards(location.state.cards);
        setSelectedCard(location.state.cards[0]);
        setLoading(false);
        return;
      }

      // Cek 2: Jika tidak ada state, fetch dari API
      try {
        const response = await fetchAllCards();
        
        // Normalisasi: Handle response berupa array [...] atau object { data: [...] }
        let validCards = [];
        if (Array.isArray(response)) {
          validCards = response;
        } else if (response && Array.isArray(response.data)) {
          validCards = response.data;
        }

        if (validCards.length > 0) {
          setCards(validCards);
          setSelectedCard(validCards[0]);
        } else {
          // API return kosong -> Fallback ke Dummy
          console.warn("API returned empty cards. Falling back to dummy data.");
          fallbackToDummy();
        }
      } catch (err) {
        // API Error -> Fallback ke Dummy
        console.error("Failed to fetch cards, using dummy fallback:", err);
        fallbackToDummy();
      } finally {
        setLoading(false);
      }
    };

    const fallbackToDummy = () => {
      if (dummyCards && dummyCards.length > 0) {
        setCards(dummyCards);
        setSelectedCard(dummyCards[0]);
        setIsUsingDummy(true);
      } else {
        setErrorMsg("No cards found (API failed & no dummy data).");
      }
    };

    initCards();
  }, [location.state]);

  // --- Effect: Load Transactions when Card/Month changes ---
  useEffect(() => {
    if (!selectedCard) return;
    
    setTransactions([]); 
    const targetMonth = selectedMonth || months[months.length - 1];
    setSelectedMonth(targetMonth);
    
    handleSelectedMonth(targetMonth, selectedCard);
  }, [selectedCard]);

  // --- Effect: Calculate Chart Data ---
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

  // --- Handlers ---
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

    // Jika sedang mode dummy cards, mungkin API transaksi juga akan gagal/kosong
    // Idealnya di sini juga ada fallback dummy transaction, tapi kita coba fetch dulu
    try {
      const data = await fetchTransactionHistory({
        month: m.month,
        year: m.year,
        accountNumber: card.account_number,
      });

      if (data?.transactions) {
        const grouped = mapTransactionsToGroups(data.transactions);
        setTransactions(grouped);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed fetching history:", error);
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

  // --- RENDER ---

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

  if (!selectedCard) {
    return (
      <div className="detail-mycard">
        <Navbar />
        <main className="main" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2>No Cards Found</h2>
          <p style={{ color: "#777", margin: "1rem 0" }}>
            {errorMsg || "You don't have any cards linked to your account."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: "0.5rem 1rem", 
              background: "#6dddd0", 
              border: "none", 
              borderRadius: "6px", 
              color: "white", 
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
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
                    {c.type} - {c.account_number} {isUsingDummy ? "(Dummy)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <p className="subtext">Track your transaction history and payment information</p>

            <div className="account-card">
              <div className="account-header">
                <div>
                  <h4>{selectedCard?.type}</h4>
                  <p className="acc-number"><strong>{selectedCard?.account_number}</strong></p>
                  <p className="acc-name">{selectedCard?.account_holder_name}</p>
                </div>
                {selectedCard?.is_main && (
                  <div className="account-card-badge"><span>Main Account</span></div>
                )}
              </div>

              <p className="balance-title">Effective Balance</p>
              <div className="balance-container">
                <h3>
                  {showBalance
                    ? `Rp ${Number(selectedCard?.effective_balance || 0).toLocaleString("id-ID")}`
                    : "•••••••••"}
                </h3>
                <span className="eye-icon" onClick={() => setShowBalance((s) => !s)}>
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            {isUsingDummy && (
              <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#fff3cd', color: '#856404', borderRadius: '4px', fontSize: '0.9rem' }}>
                ⚠️ Showing preview data (Live data unavailable)
              </div>
            )}

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

      {/* Modals */}
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