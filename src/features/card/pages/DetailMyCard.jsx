import React, { useState, useEffect, useCallback, useMemo } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { fetchAllCards, fetchTransactionHistory } from "../api/card.api";
import { fetchSplitBills } from "../../split-bill/api/split-bill.api";
import { DUMMY_CARDS } from "../data/card.dummy";
import { useNavigate } from "react-router-dom";

export default function DetailMyCard() {
  const navigate = useNavigate();

  // === Helper ===
  const getLastMonths = useCallback(() => {
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
  }, []);

  const toISO = (str) => {
    if (!str) return null;
    const [datePart, timePart = "00:00:00"] = str.split("T");
    const [y, m, d] = datePart.split("-");
    return `${y}-${m}-${d}T${timePart}`;
  };

  const mapTransactionsToGroups = useCallback((flat) => {
    const groups = {};
    flat.forEach((trx) => {
      const iso = toISO(trx.transactionDate);
      const d = iso ? new Date(iso) : new Date(trx.transactionDate);
      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) groups[key] = { date: key, sortKey: d.getTime(), items: [] };

      groups[key].items.push({
        transactionId: trx.transactionId,
        type: trx.transactionType,
        detail: trx.partyName,
        amount:
          (trx.debitCredit === "C" ? "+" : "-") +
          Number(trx.amount).toLocaleString("id-ID"),
        jenisTransaksi: trx.debitCredit === "D" ? "Pengeluaran" : "Pemasukan",
        split_bill_id: trx.splitBillId ?? null,
        partyDetail: trx.partyDetail,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map((g) => ({
        date: g.date,
        items: g.items,
      }));
  }, []);

  // === State ===
  const [cards, setCards] = useState(DUMMY_CARDS);
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });
  const [splitBillList, setSplitBillList] = useState([]);

  const months = useMemo(() => getLastMonths(), [getLastMonths]);
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  // === Fetch Cards ===
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const data = await fetchAllCards();
        if (!ignore && Array.isArray(data) && data.length) {
          const found = data.find((c) => c.account_id === selectedCard?.account_id);
          setCards(data);
          setSelectedCard(found || data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch cards", err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [selectedCard?.account_id]);

  // === Fetch Split Bills ===
  const refreshSplitBills = useCallback(async () => {
    const bills = await fetchSplitBills();
    setSplitBillList(bills || []);
  }, []);

  useEffect(() => {
    refreshSplitBills();
  }, [refreshSplitBills]);

  // === Fetch Transactions ===
  const handleSelectedMonth = useCallback(
    async (m, forcedCard) => {
      const card = forcedCard || selectedCard;
      if (!card) return;

      setSelectedMonth(m);
      const data = await fetchTransactionHistory({
        month: m.month,
        year: m.year,
        accountNumber: card.account_number,
      });

      const tx = data?.transaction || [];
      const grouped = mapTransactionsToGroups(tx);
      setTransactions(grouped);
    },
    [selectedCard, mapTransactionsToGroups]
  );

  useEffect(() => {
    if (!selectedCard) return;
    const last = months[months.length - 1];
    handleSelectedMonth(last);
  }, [selectedCard, months, handleSelectedMonth]);

  // === Chart ===
  useEffect(() => {
    const flat = transactions.flatMap((g) => g.items || []);
    const income = flat
      .filter((x) => x.amount.startsWith("+"))
      .reduce((s, x) => s + Number(x.amount.replace(/[^\d]/g, "")), 0);
    const expense = flat
      .filter((x) => x.amount.startsWith("-"))
      .reduce((s, x) => s + Number(x.amount.replace(/[^\d]/g, "")), 0);
    setChartData({ income, expense });
  }, [transactions]);

  // === Card Change ===
  const handleChangeCard = async (accountId) => {
    const found = cards.find((c) => c.account_id === accountId);
    if (!found) return;
    setSelectedCard(found);
    const last = months[months.length - 1];
    await handleSelectedMonth(last, found);
  };

  // === Split Modal ===
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

  // === Split Bill Lookup ===
  const findSplitBillByTrx = (trxId) =>
    splitBillList.find((b) => String(b.ref_id) === String(trxId));

  // === Render ===
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
                <span
                  className="eye-icon"
                  onClick={() => setShowBalance((s) => !s)}
                  role="button"
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
                <p><strong>Income</strong></p>
              </div>
              <div>
                <h3>Rp{chartData.expense.toLocaleString("id-ID")}</h3>
                <p><strong>Expenses</strong></p>
              </div>
            </div>
            <p className="difference">
              <strong>
                A difference of Rp
                {(chartData.income - chartData.expense).toLocaleString("id-ID")}
              </strong>
            </p>

            {/* Chart */}
            <div className="bar-chart">
              <div
                className="bar income-bar"
                style={{
                  height: `${chartData.income
                    ? Math.max(
                        10,
                        (chartData.income / Math.max(chartData.income, chartData.expense || 1)) * 100
                      )
                    : 8}%`,
                }}
              />
              <div
                className="bar expense-bar"
                style={{
                  height: `${chartData.expense
                    ? Math.max(
                        6,
                        (chartData.expense / Math.max(chartData.income || 1, chartData.expense)) * 100
                      )
                    : 6}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="right-panel">
          <div className="transactions">
            <div className="transaction-header"><h3>Transaction History</h3></div>

            <div className="months">
              {months.map((m) => (
                <button
                  key={`${m.month}-${m.year}`}
                  className={
                    m.month === selectedMonth?.month && m.year === selectedMonth?.year ? "active" : ""
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
                    <p className="transaction-date"><strong>{group.date}</strong></p>
                    <hr />
                    {group.items.map((item, iIdx) => {
                      const isFinanceProduct =
                        /LFG|Life Goals|DPLK|Deposit|Time Deposit|Pension|Auto Debit|Placement/i.test(
                          `${item.detail} ${item.partyDetail} ${item.type}`
                        );

                      const splitMatch = findSplitBillByTrx(item.transactionId);
                      const alreadySplit = Boolean(splitMatch);

                      return (
                        <div key={iIdx} className="transaction-modern-item">
                          <div className="transaction-text">
                            <p className="transaction-type">{item.type}</p>
                            <p className="transaction-detail">{item.detail}</p>
                          </div>
                          <div className="transaction-amount-modern">
                            <span
                              className={`amount ${item.amount.startsWith("+") ? "credit" : "debit"}`}
                            >
                              {item.amount}
                            </span>

                            {/* Split Bill Logic */}
                            {item.jenisTransaksi === "Pengeluaran" && !isFinanceProduct && (
                              <button
                                className="split-btn"
                                onClick={() => {
                                  if (alreadySplit) {
                                    navigate(`/splitbill/detail/${splitMatch.split_bill_id}`);
                                  } else {
                                    handleOpenSplit(group, iIdx);
                                  }
                                }}
                              >
                                {alreadySplit ? "View Split Bill" : "Split Bill?"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No transactions available for {selectedMonth?.label} {selectedMonth?.year}
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
              refreshSplitBills();
            }}
            onSuccess={() => refreshSplitBills()}
            transaction={selectedTransaction}
          />
        </div>
      )}
    </div>
  );
}