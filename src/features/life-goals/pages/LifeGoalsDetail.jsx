import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import LifeGoalsCard from "../components/LifeGoalsCard";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import "../styles/life-goals-detail.css";
import {
  fetchLifeGoalTransactions,
  fetchLifeGoalDetail,
} from "../api/life-goals.api";

export default function LifeGoalDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const goal = state?.goal || {};
  const accountNumber = state?.accountNumber;

  const [transactions, setTransactions] = useState({});
  const [goalDetail, setGoalDetail] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const months = [
    "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov",
    "Dec", "Jan", "Feb", "Mar", "Apr",
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [txRes, detailRes] = await Promise.all([
          fetchLifeGoalTransactions(accountNumber),
          fetchLifeGoalDetail(accountNumber),
        ]);
        setTransactions(txRes || {});
        setGoalDetail(detailRes?.data || null);
      } catch {
        setTransactions({});
        setGoalDetail(null);
      } finally {
        setLoading(false);
      }
    }
    if (accountNumber) loadData();
  }, [accountNumber]);

  if (loading || !goalDetail)
    return <div className="loading">Loading...</div>;

  const toDate = (str) => {
    if (!str) return "";
    const [d, m, rest] = str.split("-");
    const y = (rest || "").split("T")[0];
    if (!y) return str;
    return new Date(`${y}-${m}-${d}`);
  };

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      className="lg-container"
      style={{
        "--theme": goal.color || "#71d9d0",
        "--accent-gradient": `linear-gradient(135deg, ${goal.color ||
          "#71d9d0"} 0%, #ffffff 100%)`,
      }}
    >
      <Navbar />
      <main className="lg-main">
        <header className="lg-header">
          <button
            className="lg-back shimmer"
            onClick={() => navigate(-1)}
            onMouseMove={handleMouseMove}
          >
            ← Back to Life Goals
          </button>
        </header>

        <div className="lg-grid">
          {/* LEFT COLUMN */}
          <section className="left-column">
            <LifeGoalsCard
              goal={{
                title: goal.title,
                lifegoalsSubtitle: goal.desc,
                current: goal.current,
                target: goal.target,
                color: goal.color,
              }}
              onClick={() => {}}
            />

            <div className="history-panel glass-card">
              <div className="panel-header">
                <h3 className="panel-title">Transaction History</h3>
              </div>

              <div className="months-row">
                {months.map((m) => (
                  <button
                    key={m}
                    className={`month-pill ${
                      selectedMonth === m ? "active" : ""
                    }`}
                    onClick={() => setSelectedMonth(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="tx-list">
                {Array.isArray(transactions[selectedMonth]) &&
                transactions[selectedMonth].length > 0 ? (
                  [...transactions[selectedMonth]]
                    .reverse()
                    .map((group, gi) => (
                      <div key={gi} className="tx-group">
                        <div className="tx-date">{group.date}</div>
                        {group.items.map((tx, i) => (
                          <div 
                            key={i} 
                            className="tx-row"
                            onClick={() => {
                              setSelectedTransaction({
                                transactionId: `LFG-${selectedMonth}-${gi}-${i}`,
                                transactionDate: group.date,
                                transactionType: tx.type,
                                partyName: tx.type,
                                partyDetail: tx.desc,
                                amount: tx.amount,
                                debit_credit: String(tx.amount).startsWith("-") ? "D" : "C",
                              });
                              setShowDetailModal(true);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="tx-left">
                              <div className="tx-dot" />
                              <div className="tx-text">
                                <div className="tx-type">{tx.type}</div>
                                <div className="tx-sub">{tx.desc}</div>
                              </div>
                            </div>
                            <div
                              className={`tx-amount ${
                                String(tx.amount).startsWith("-")
                                  ? "neg"
                                  : "pos"
                              }`}
                            >
                              {tx.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                ) : (
                  <div className="tx-empty">
                    No transactions for {selectedMonth}.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <aside className="info-column glass-card">
            <h3 className="info-title">Life Goal Details</h3>
            <div className="info-grid">
              <div className="label">Account Number</div>
              <div className="value">{goalDetail.accountNumber}</div>

              <div className="label">Estimated Accumulated Funds</div>
              <div className="value">
                Rp{Number(
                  goalDetail.estimatedAccumulatedBalance || 0
                ).toLocaleString("id-ID")}
              </div>

              <div className="label">Initial Deposit</div>
              <div className="value">
                Rp{Number(goalDetail.initalDeposit || 0).toLocaleString(
                  "id-ID"
                )}
              </div>

              <div className="label">Annual Interest Rate</div>
              <div className="value">
                {(Number(goalDetail.interestRate || 0) * 100)
                  .toFixed(2)
                  .replace(/\.00$/, "")}
                %
              </div>

              <div className="label">Duration</div>
              <div className="value">
                {goalDetail.lifegoalsDuration} years
              </div>

              <div className="label">Created On</div>
              <div className="value">
                {toDate(goalDetail.createdTime).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="divider" />

              <div className="label">Maturity Date</div>
              <div className="value">
                {toDate(goalDetail.maturityDate).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="label">Disbursement Account</div>
              <div className="value">
                {goalDetail.disbursementAccountNumber}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showDetailModal && selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
          productType="LFG"
        />
      )}
    </div>
  );
}