// src/features/cards/pages/DetailMyCard.jsx
import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { DUMMY_CARDS } from "../data/card.dummy";
import { useNavigate } from "react-router-dom";

export default function DetailMyCard() {
  // --- Helpers ---
  const getLastMonths = () => {
    const now = new Date();
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        label: d.toLocaleString("en-US", { month: "short" }), // UI label
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }
    return arr.reverse();
  };

  const toISOFromDMY = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    const [dPart, tPart = "00:00:00"] = dateTimeStr.split("T");
    const [dd, mm, yyyy] = dPart.split("-");
    if (!dd || !mm || !yyyy) return null;
    return `${yyyy}-${mm}-${dd}T${tPart}`;
  };

  const mapTransactionsToGroups = (flat) => {
    const groups = {};
    flat.forEach((trx) => {
      const iso = toISOFromDMY(trx.transactionDate);
      const d = iso ? new Date(iso) : new Date(trx.transactionDate); // fallback just in case
      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }); // ex: "25 Sep"

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      groups[key].items.push({
        id: trx.transactionId,
        type: trx.transactionType,
        detail: trx.partyName,
        amount: (trx.debit_credit === "C" ? "+" : "-") + trx.amount,
        jenisTransaksi: trx.debit_credit === "D" ? "Pengeluaran" : "Pemasukan",
        split_bill_id: trx.split_bill_id ?? null
      });
    });

    // sort by date (newest first) and return without sortKey
    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  // --- State ---
  const [cards, setCards] = useState(DUMMY_CARDS);
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(
    getLastMonths()[getLastMonths().length - 1]
  );

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Transactions grouped by date (kept same structure with previous UI)
  const [transactions, setTransactions] = useState([]);

  // Chart still depends on the grouped structure; leave as-is
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  // --- Load Cards (once) ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAllCards();
        if (!mounted) return;
        if (Array.isArray(data) && data.length) {
          setCards(data);
          const current =
            data.find((c) => c.account_id === selectedCard?.account_id) ||
            data[0];
          setSelectedCard(current);
        }
      } catch {
        // fallback already set via DUMMY_CARDS
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Auto fetch when selectedCard changes (first load & card change) ---
  useEffect(() => {
    if (!selectedCard) return;
    const last = months[months.length - 1];
    setSelectedMonth(last);
    handleSelectedMonth(last);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard]);

  // --- Chart calculation (keep as-is) ---
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

  const handleChangeCard = async (accountId) => {
    const found = cards.find((c) => c.account_id === accountId);
    if (!found) return;
    setSelectedCard(found);

    const last = months[months.length - 1];
    setSelectedMonth(last);
    await handleSelectedMonth(last, found);
  };

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
    console.log('cc', card.account_number);
  };


  // --- Render ---
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
                value={selectedCard?.account_id}
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
                  <h4>{selectedCard?.type}</h4>
                  <p className="acc-number">
                    <strong>{selectedCard?.account_number}</strong>
                  </p>
                  <p className="acc-name">
                    {selectedCard?.account_holder_name}
                  </p>
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
                    ? `Rp ${Number(
                      selectedCard?.effective_balance || 0
                    ).toLocaleString("id-ID")}`
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
                    ? Math.max(
                      10,
                      (chartData.income /
                        Math.max(
                          chartData.income,
                          chartData.expense || 1
                        )) *
                      100
                    )
                    : 8
                    }%`,
                }}
              />
              <div
                className="bar expense-bar"
                style={{
                  height: `${chartData.expense
                    ? Math.max(
                      6,
                      (chartData.expense /
                        Math.max(
                          chartData.income || 1,
                          chartData.expense
                        )) *
                      100
                    )
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
                  key={m.month + "-" + m.year}
                  className={
                    m.month === selectedMonth?.month &&
                      m.year === selectedMonth?.year
                      ? "active"
                      : ""
                  }
                  onClick={() => handleSelectedMonth(m)}
                >
                  {m.label}
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
                            className={`amount ${item.amount.startsWith("+") ? "credit" : "debit"
                              }`}
                          >
                            {item.amount}
                          </span>
                          {item.jenisTransaksi === "Pengeluaran" && (
                            <button
                              className="split-btn"
                              onClick={() => {
                                if (item.split_bill_id) {
                                  navigate(`/split-bill/view/${item.split_bill_id}`)
                                } else {
                                  handleOpenSplit(group, iIdx)
                                }
                              }}
                            >
                              {item.split_bill_id ? "View Split Bill" : "Split Bill?"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No transactions available for {selectedMonth?.label}{" "}
                  {selectedMonth?.year}
                </p>
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
