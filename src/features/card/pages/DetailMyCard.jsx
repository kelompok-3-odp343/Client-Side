import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { useNavigate, useLocation } from "react-router-dom";

export default function DetailMyCard() {
  // --- Helpers ---
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
      const d = iso ? new Date(iso) : new Date(trx.transactionDate);

      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      groups[key].items.push({
        transactionId: trx.transactionId,
        type: trx.transactionType,
        detail: trx.partyName,
        amount: (trx.debit_credit === "C" ? "+" : "-") + trx.amount,
        jenisTransaksi: trx.debit_credit === "D" ? "Pengeluaran" : "Pemasukan",
        split_bill_id: trx.split_bill_id ?? null
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
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const [chartData, setChartData] = useState({ income: 0, expense: 0 });
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Initial Load: always fetch cards (API first → fallback dummy)
  useEffect(() => {
    let mounted = true;

    (async () => {
      const dataFromState = location.state?.cards;

      if (Array.isArray(dataFromState) && dataFromState.length > 0) {
        // still allow API fallback later
        setCards(dataFromState);
        setSelectedCard(dataFromState[0]);
      } else {
        const apiCards = await fetchAllCards();
        if (!mounted) return;

        setCards(apiCards);
        setSelectedCard(apiCards[0]);
      }
    })();

    return () => (mounted = false);
  }, [location.state]);

  // When selected card is ready, load latest month's transactions
  useEffect(() => {
    if (!selectedCard) return;
    const latestMonth = months[months.length - 1];
    setSelectedMonth(latestMonth);
    handleSelectedMonth(latestMonth, selectedCard);
  }, [selectedCard]);

  // Recompute income/expense chart
  useEffect(() => {
    const flatItems = transactions.flatMap((g) => g.items || []);
    const income = flatItems
      .filter((i) => i.amount.startsWith("+"))
      .reduce((s, i) => s + Number(i.amount.replace(/[^\d]/g, "")), 0);
    const expense = flatItems
      .filter((i) => i.amount.startsWith("-"))
      .reduce((s, i) => s + Number(i.amount.replace(/[^\d]/g, "")), 0);

    setChartData({ income, expense });
  }, [transactions]);

  // Change card event
  const handleChangeCard = async (accountNumber) => {
    const found = cards.find((c) => c.account_number === accountNumber);
    if (!found) return;

    setSelectedCard(found);
    const latest = months[months.length - 1];
    await handleSelectedMonth(latest, found);
  };

  const handleOpenSplit = (group, itemIndex) => {
    const item = group.items[itemIndex];
    setSelectedTransaction({
      transactionId: item.transactionId,
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

    const trxArr = data.transaction || data.transactions || [];

    const grouped = mapTransactionsToGroups(trxArr);
    setTransactions(grouped);
  };

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="main">
        {/* LEFT PANEL */}
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

            {/* Card Display */}
            {selectedCard && (
              <div className="account-card">
                <div className="account-header">
                  <div>
                    <h4>{selectedCard.type}</h4>
                    <p className="acc-number"><strong>{selectedCard.account_number}</strong></p>
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
                      ? `Rp ${Number(selectedCard.effective_balance)
                          .toLocaleString("id-ID")}`
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
              <strong>A difference of Rp{(chartData.income - chartData.expense)
                .toLocaleString("id-ID")}</strong>
            </p>

            <div className="bar-chart">
              <div
                className="bar income-bar"
                style={{
                  height: `${chartData.income
                    ? Math.max(10, chartData.income /
                      Math.max(chartData.income, chartData.expense || 1) * 100)
                    : 8}%`,
                }}
              />
              <div
                className="bar expense-bar"
                style={{
                  height: `${chartData.expense
                    ? Math.max(6, chartData.expense /
                      Math.max(chartData.income || 1, chartData.expense) * 100)
                    : 6}%`,
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
                    m.month === selectedMonth.month &&
                    m.year === selectedMonth.year
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
                transactions.map((group) => (
                  <div key={group.date} className="transaction-group">
                    <p className="transaction-date">
                      <strong>{group.date}</strong>
                    </p>
                    <hr />
                    {group.items.map((item, idx) => (
                      <div key={`${item.transactionId}-${idx}`} className="transaction-modern-item">
                        <div className="transaction-text">
                          <p className="transaction-type">{item.type}</p>
                          <p className="transaction-detail">{item.detail}</p>
                        </div>
                        <div className="transaction-amount-modern">
                          <span className={`amount ${item.amount.startsWith("+") ? "credit" : "debit"}`}>
                            {item.amount}
                          </span>

                          {item.jenisTransaksi === "Pengeluaran" && (
                            <button
                              className="split-btn"
                              onClick={() =>
                                item.split_bill_id
                                  ? navigate(`/split-bill/view/${item.split_bill_id}`)
                                  : handleOpenSplit(group, idx)
                              }
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
                  No transactions available for {selectedMonth.label} {selectedMonth.year}
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