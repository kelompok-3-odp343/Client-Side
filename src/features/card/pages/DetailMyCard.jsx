import React, { useState, useEffect } from "react";
import SplitBillForm from "../../../shared/components/SplitBillForm";
import "../styles/detail-my-card.css";
import Navbar from "../../../shared/components/Navbar";
import { EyeOff, Eye } from "lucide-react";
import { DUMMY_CARDS, DUMMY_TRANSACTIONS } from "../data/card.dummy";

export default function DetailMyCard() {
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [showBalance, setShowBalance] = useState(true);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });

  // normalisasi nama bulan
  const normalize = (m) => m?.toLowerCase().slice(0, 3);

  // daftar bulan (singkatan tapi tetap support matching)
  const months = [
    "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"
  ];

  // ambil transaksi per akun dan bulan
  useEffect(() => {
    const allTx = DUMMY_TRANSACTIONS[selectedCard.account_id] || [];
    const filtered = allTx.filter(
      (t) => normalize(t.month) === normalize(selectedMonth)
    );
    setTransactions(filtered);
  }, [selectedCard, selectedMonth]);

  // hitung income dan expense
  useEffect(() => {
    const allTx = DUMMY_TRANSACTIONS[selectedCard.account_id] || [];
    const monthTx = allTx.filter(
      (t) => normalize(t.month) === normalize(selectedMonth)
    );

    const income = monthTx
      .flatMap((t) => t.items)
      .filter((i) => i.amount.startsWith("+"))
      .reduce((s, i) => s + Number(i.amount.replace(/[^\d]/g, "")), 0);

    const expense = monthTx
      .flatMap((t) => t.items)
      .filter((i) => i.amount.startsWith("-"))
      .reduce((s, i) => s + Number(i.amount.replace(/[^\d]/g, "")), 0);

    setChartData({ income, expense });
  }, [selectedCard, selectedMonth]);

  return (
    <div className="detail-mycard">
      <Navbar />

      <main className="dm-main">
        {/* LEFT PANEL */}
        <aside className="dm-left">
          <div className="account-header">
            <h2>Account Details</h2>
            <select
              value={selectedCard.account_id}
              onChange={(e) =>
                setSelectedCard(
                  DUMMY_CARDS.find((c) => c.account_id === e.target.value)
                )
              }
            >
              {DUMMY_CARDS.map((c) => (
                <option key={c.account_id} value={c.account_id}>
                  {c.type} - {c.account_number}
                </option>
              ))}
            </select>
          </div>

          <p className="subtext">
            Track your transaction history and payment information
          </p>

          {/* ACCOUNT CARD */}
          <div className="account-card">
            <div className="acc-left">
              <div className="acc-type">{selectedCard.type}</div>
              <div className="acc-number">{selectedCard.account_number}</div>
              <div className="acc-name">{selectedCard.account_holder_name}</div>

              <div className="acc-balance">
                <div className="balance-title">Effective Balance</div>
                <div className="balance-row">
                  <h3>
                    {showBalance
                      ? `Rp ${selectedCard.effective_balance.toLocaleString(
                          "id-ID"
                        )}`
                      : "Rp •••••••"}
                  </h3>
                  <button
                    className="eye-btn"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {selectedCard.is_main && (
              <div className="main-label">Main Account</div>
            )}
          </div>

          <div className="warning">
            ⚠️ Do not share card number, expiration date, or CVV/CVC code with
            anyone.
          </div>

          {/* EARNINGS SECTION */}
          <div className="earn-title-outside">
            <h4>Earnings Overview</h4>
            <span className="earn-month">({selectedMonth} 2025)</span>
          </div>

          <div className="earnings">
            <div className="earn-values">
              <div className="ev">
                <div className="ev-num">
                  Rp{chartData.income.toLocaleString("id-ID")}
                </div>
                <div className="ev-label">
                  <span className="dot income-dot"></span> Income
                </div>
              </div>
              <div className="ev">
                <div className="ev-num">
                  Rp{chartData.expense.toLocaleString("id-ID")}
                </div>
                <div className="ev-label">
                  <span className="dot expense-dot"></span> Expenses
                </div>
              </div>
            </div>

            <div className="difference">
              A difference of Rp
              {(chartData.income - chartData.expense).toLocaleString("id-ID")}
            </div>

            <div className="bar-chart centered">
              <div className="bar-line" />
              <div
                className="bar income"
                style={{
                  height: `${
                    (chartData.income /
                      Math.max(chartData.income, chartData.expense || 1)) *
                    90
                  }px`,
                }}
              />
              <div
                className="bar expense"
                style={{
                  height: `${
                    (chartData.expense /
                      Math.max(chartData.income, chartData.expense || 1)) *
                    90
                  }px`,
                }}
              />
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <section className="dm-right">
          <div className="tx-header">
            <h2>Transaction History</h2>
          </div>

          <div className="month-row">
            {months.map((m) => (
              <button
                key={m}
                className={normalize(m) === normalize(selectedMonth) ? "month active" : "month"}
                onClick={() => setSelectedMonth(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="tx-list">
            {transactions.length ? (
              transactions.map((group, gi) => (
                <div key={gi} className="tx-day">
                  <div className="tx-day-title">
                    <strong>{group.date}</strong>
                  </div>
                  <hr />
                  {group.items.map((item, ii) => (
                    <div key={ii} className="tx-row">
                      <div className="tx-left-col">
                        <div className="tx-type">{item.type}</div>
                        <div className="tx-detail">{item.detail}</div>
                      </div>
                      <div className="tx-right-col">
                        <div
                          className={`amount ${
                            item.amount.startsWith("+") ? "credit" : "debit"
                          }`}
                        >
                          {item.amount}
                        </div>
                        {item.jenisTransaksi === "Pengeluaran" && (
                          <button
                            className="split-btn"
                            onClick={() => {
                              setSelectedTransaction({
                                id: `${group.date}-${ii}`,
                                date: group.date,
                                detail: item.detail,
                                amount: item.amount,
                              });
                              setShowSplitModal(true);
                            }}
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
              <div className="no-data">
                No transactions available for {selectedMonth}
              </div>
            )}
          </div>
        </section>
      </main>

      {showSplitModal && selectedTransaction && (
        <div className="modal-overlay">
          <SplitBillForm
            onClose={() => setShowSplitModal(false)}
            transaction={selectedTransaction}
          />
        </div>
      )}
    </div>
  );
}