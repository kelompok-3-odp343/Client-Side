import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { fetchAllCards, fetchCardTransactions } from "../api/card.api";
import { DUMMY_CARDS, DUMMY_TRANSACTIONS } from "../data/card.dummy";

export default function DetailMyCard() {
  const months = [
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
  ];

  const [cards, setCards] = useState(DUMMY_CARDS);
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  // helper: normalize month to 3-letter lowercase for robust matching
  const normalize = (m) => (m || "").toString().toLowerCase().slice(0, 3);

  // load cards (api-ready, fallback to dummy)
  useEffect(() => {
    let mounted = true;
    async function loadCards() {
      try {
        const data = await fetchAllCards();
        if (!mounted) return;
        if (Array.isArray(data) && data.length) {
          setCards(data);
          // keep current selection if present, otherwise pick first
          const current =
            data.find((c) => c.account_id === selectedCard?.account_id) ||
            data[0];
          setSelectedCard(current);
        }
      } catch {
        /* fallback already set */
      }
    }
    loadCards();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load transactions when selectedCard or month changes
  useEffect(() => {
    let mounted = true;
    async function loadTx() {
      try {
        const res = await fetchCardTransactions(selectedCard.account_id);
        const arr = Array.isArray(res) ? res : [];
        if (!mounted) return;
        // filter by month (robust)
        const filtered = arr.filter(
          (g) => normalize(g.month) === normalize(selectedMonth)
        );
        setTransactions(filtered);
      } catch {
        // fallback to dummy transactions if api fails
        const arr = DUMMY_TRANSACTIONS[selectedCard.account_id] || [];
        const filtered = arr.filter(
          (g) => normalize(g.month) === normalize(selectedMonth)
        );
        if (mounted) setTransactions(filtered);
      }
    }
    if (selectedCard?.account_id) loadTx();
    return () => {
      mounted = false;
    };
  }, [selectedCard, selectedMonth]);

  // compute chart data based on current transactions
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

  // when user changes selected card via select
  const handleChangeCard = (accountId) => {
    const found = cards.find((c) => c.account_id === accountId);
    if (found) {
      setSelectedCard(found);
      // reset month to default May so charts update predictably
      setSelectedMonth("May");
      setSelectedTransaction(null);
    }
  };

  // open split bill form with the exact transaction clicked
  const handleOpenSplit = (group, itemIndex) => {
    const item = group.items[itemIndex];
    setSelectedTransaction({
      id: `${group.date}-${itemIndex}`,
      date: group.date,
      detail: item.detail,
      amount: item.amount,
      account_id: selectedCard.account_id,
    });
    setShowSplitModal(true);
  };

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="main">
        {/* LEFT PANEL */}
        <section className="left-panel">
          <div className="account-details">
            <div className="account-details-dropdown">
              <h2>
                <strong>Account Details</strong>
              </h2>
              <select
                value={selectedCard.account_id}
                onChange={(e) => handleChangeCard(e.target.value)}
              >
                {cards.map((c) => (
                  <option key={c.account_id} value={c.account_id}>
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
                  <h4>{selectedCard.type}</h4>
                  <p className="acc-number">
                    <strong>{selectedCard.account_number}</strong>
                  </p>
                  <p className="acc-name">{selectedCard.account_holder_name}</p>
                </div>
                {selectedCard.is_main && (
                  <div className="account-card-badge">
                    <span>Main Account</span>
                  </div>
                )}
              </div>

              <p className="balance-title">Effective Balance</p>
              <div className="balance-container">
                <h3>
                  {showBalance
                    ? `Rp ${Number(selectedCard.effective_balance).toLocaleString(
                        "id-ID"
                      )}`
                    : "•••••••••"}
                </h3>
                <span
                  className="eye-icon"
                  onClick={() => setShowBalance((s) => !s)}
                  role="button"
                  aria-label="toggle balance"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="warning-box">
              ⚠️ Do not share card number, expiration date, or CVV/CVC code with
              anyone.
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
                  height: `${chartData.income
                    ? Math.max(10, (chartData.income / Math.max(chartData.income, chartData.expense || 1)) * 100)
                    : 8
                  }%`,
                }}
              />
              <div
                className="bar expense-bar"
                style={{
                  height: `${chartData.expense
                    ? Math.max(6, (chartData.expense / Math.max(chartData.income || 1, chartData.expense)) * 100)
                    : 6
                  }%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="right-panel">
          <div className="transactions">
            <div className="transaction-header">
              <h3>Transaction History</h3>
            </div>

            <div className="months">
              {months.map((m) => (
                <button
                  key={m}
                  className={normalize(m) === normalize(selectedMonth) ? "active" : ""}
                  onClick={() => setSelectedMonth(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="transaction-list-modern">
              {transactions.length ? (
                transactions.map((group, gIdx) => (
                  <div key={gIdx} className="transaction-group">
                    <p className="transaction-date">
                      <strong>{group.date}</strong>
                    </p>
                    <hr />
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="transaction-modern-item">
                        <div className="transaction-text">
                          <p className="transaction-type">{item.type}</p>
                          <p className="transaction-detail">{item.detail}</p>
                        </div>
                        <div className="transaction-amount-modern">
                          <span
                            className={`amount ${
                              item.amount.startsWith("+") ? "credit" : "debit"
                            }`}
                          >
                            {item.amount}
                          </span>
                          {item.jenisTransaksi === "Pengeluaran" && (
                            <button
                              className="split-btn"
                              onClick={() => handleOpenSplit(group, iIdx)}
                            >
                              Split bill?
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="no-data">No transactions available for {selectedMonth}</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {showSplitModal && selectedTransaction && (
        <div className="modal-overlay">
          <SplitBillForm
            onClose={() => {
              setShowSplitModal(false);
              setSelectedTransaction(null);
            }}
            transaction={selectedTransaction}
          />
        </div>
      )}
    </div>
  );
}