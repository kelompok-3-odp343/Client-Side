const handleDownloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to download");
      return;
    }

    // Prepare CSV data
    const csvData = [];
    csvData.push([
      "Date",
      "Transaction Type",
      "Description",
      "Amount",
      "Type",
      "Split Bill Status",
    ]);

    transactions.forEach((group) => {
      group.items.forEach((item) => {
        const type = item.debit_credit === "C" ? "Credit" : "Debit";
        const amount = item.amount.replace(/[^\d]/g, "");
        const splitStatus = item.split_bill_id ? "Split Bill Created" : "-";
        csvData.push([
          item.transactionDate,
          item.type,
          item.detail,
          amount,
          type,
          splitStatus,
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
      `Savings_Transactions_${selectedCard?.account_number}_${selectedMonth?.label}_${selectedMonth?.year}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { useNavigate, useLocation } from "react-router-dom";

export default function DetailMyCard() {
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
        // Try parsing the date in various formats
        const dateStr = trx.transactionDate;
        if (!dateStr) return;
        
        // Format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
        if (dateStr.includes('-')) {
          d = new Date(dateStr);
        } else {
          d = new Date(dateStr);
        }
        
        // Check if date is valid
        if (isNaN(d.getTime())) {
          console.warn('Invalid date:', dateStr);
          return;
        }
      } catch (e) {
        console.warn('Error parsing date:', trx.transactionDate, e);
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
        amount: (trx.debit_credit === "C" ? "+" : "-") + trx.amount,
        debit_credit: trx.debit_credit,
        jenisTransaksi: trx.debit_credit === "D" ? "Pengeluaran" : "Pemasukan",
        split_bill_id: trx.split_bill_id ?? null,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const initialCards = location.state?.cards || [];
  const [cards, setCards] = useState(initialCards);
  const [selectedCard, setSelectedCard] = useState(initialCards[0] || null);
  const [showBalance, setShowBalance] = useState(true);

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(
    getLastMonths()[getLastMonths().length - 1]
  );

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (cards.length > 0) return;
      try {
        const data = await fetchAllCards();
        if (!mounted) return;
        if (Array.isArray(data) && data.length) {
          setCards(data);
          setSelectedCard(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [cards]);

  useEffect(() => {
    if (!selectedCard) return;
    const last = months[months.length - 1];
    setSelectedMonth(last);
    handleSelectedMonth(last);
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

  const handleChangeCard = async (accountNumber) => {
    const found = cards.find((c) => c.account_number === accountNumber);
    if (!found) return;
    setSelectedCard(found);

    const last = months[months.length - 1];
    setSelectedMonth(last);
    await handleSelectedMonth(last, found);
  };

  const handleOpenSplit = (item) => {
    setSelectedTransaction({
      transactionId: item.transactionId,
      date: item.transactionDate,
      detail: item.detail,
      amount: item.amount,
      account_id: selectedCard.account_id,
      accountNumber: selectedCard.account_number,
      transactionDate: item.transactionDate,
    });
    setShowSplitModal(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedTransaction(item);
    setShowDetailModal(true);
  };

  const handleSelectedMonth = async (m, forcedCard) => {
    const card = forcedCard || selectedCard;
    if (!card) return;

    setSelectedMonth(m);

    const data = await fetchTransactionHistory({
      month: m.month,
      year: m.year,
      accountNumber: card.account_number,
    });

    if (!data?.transactions) {
      setTransactions([]);
      return;
    }

    const grouped = mapTransactionsToGroups(data.transactions);
    setTransactions(grouped);
  };

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="main">
        <section className="left-panel">
          <div className="account-details">
            <div className="account-details-dropdown">
              <h2>
                <strong>Account Details</strong>
              </h2>
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

            <p className="subtext">
              Track your transaction history and payment information
            </p>

            <div className="account-card">
              <div className="account-header">
                <div>
                  <h4>{selectedCard?.type}</h4>
                  <p className="acc-number">
                    <strong>{selectedCard?.account_number}</strong>
                  </p>
                  <p className="acc-name">{selectedCard?.account_holder_name}</p>
                </div>

                {selectedCard?.is_main && (
                  <div className="account-card-badge">
                    <span>Main Account</span>
                  </div>
                )}
              </div>

              <p className="balance-title">Effective Balance</p>
              <div className="balance-container">
                <h3>
                  {showBalance
                    ? `Rp ${Number(selectedCard?.effective_balance || 0).toLocaleString("id-ID")}`
                    : "•••••••••"}
                </h3>
                <span
                  className="eye-icon"
                  onClick={() => setShowBalance((s) => !s)}
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
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
                <p>
                  <strong>Income</strong>
                </p>
              </div>
              <div>
                <h3>Rp{chartData.expense.toLocaleString("id-ID")}</h3>
                <p>
                  <strong>Expenses</strong>
                </p>
              </div>
            </div>

            <p className="difference">
              <strong>
                A difference of Rp
                {(chartData.income - chartData.expense).toLocaleString("id-ID")}
              </strong>
            </p>

            <div className="bar-chart">
              <div
                className="bar income-bar"
                style={{
                  height: `${
                    chartData.income
                      ? Math.max(
                          10,
                          (chartData.income /
                            Math.max(chartData.income, chartData.expense || 1)) *
                            100
                        )
                      : 8
                  }%`,
                }}
              />
              <div
                className="bar expense-bar"
                style={{
                  height: `${
                    chartData.expense
                      ? Math.max(
                          6,
                          (chartData.expense /
                            Math.max(chartData.income || 1, chartData.expense)) *
                            100
                        )
                      : 6
                  }%`,
                }}
              />
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

                const updated = {
                  ...(selectedTransaction || {}),
                  split_bill_id: newSplitBillId,
                };

                setSelectedTransaction(updated);
                setShowSplitModal(false);

                if (action === "view") {
                  navigate(`/splitbill/detail`, {
                    state: { splitBillId: newSplitBillId, color: "#6dddd0" },
                  });
                  return;
                }

                if (action === "stay") {
                  return;
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}