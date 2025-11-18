import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import LifeGoalsCard from "../components/LifeGoalsCard";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
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

  const [transactions, setTransactions] = useState([]);
  const [goalDetail, setGoalDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const months = [
    "May",
    "Jun",
    "Jul",
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

  const [selectedMonth, setSelectedMonth] = useState("May");

  // Convert months array to format compatible with TransactionHistory
  const monthsData = months.map((label, index) => {
    const now = new Date();
    const monthIndex = months.indexOf(label);
    const yearOffset = monthIndex < 4 ? 1 : 0; // Jan-Apr are next year
    
    return {
      label,
      month: monthIndex + 1,
      year: now.getFullYear() + yearOffset,
    };
  });

  const selectedMonthData = monthsData.find((m) => m.label === selectedMonth);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [txRes, detailRes] = await Promise.all([
          fetchLifeGoalTransactions(accountNumber),
          fetchLifeGoalDetail(accountNumber),
        ]);
        
        // Convert transaction format to groups
        const txData = txRes || {};
        const allTransactions = [];

        months.forEach((month) => {
          const monthData = txData[month];
          if (Array.isArray(monthData) && monthData.length > 0) {
            monthData.forEach((group) => {
              allTransactions.push({
                date: group.date,
                month: month,
                items: group.items.map((item) => ({
                  transactionId: `LFG-${month}-${item.type}-${item.desc}`,
                  transactionDate: group.date,
                  type: item.type,
                  transactionType: item.type,
                  detail: item.desc,
                  partyName: item.type,
                  partyDetail: item.desc,
                  amount: item.amount,
                  debit_credit: String(item.amount).startsWith("-") ? "D" : "C",
                  jenisTransaksi: String(item.amount).startsWith("-")
                    ? "Pengeluaran"
                    : "Pemasukan",
                })),
              });
            });
          }
        });

        setTransactions(allTransactions);
        setGoalDetail(detailRes?.data || null);
      } catch {
        setTransactions([]);
        setGoalDetail(null);
      } finally {
        setLoading(false);
      }
    }
    if (accountNumber) loadData();
  }, [accountNumber]);

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter(
    (group) => group.month === selectedMonth
  );

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
        "--accent-gradient": `linear-gradient(135deg, ${
          goal.color || "#71d9d0"
        } 0%, #ffffff 100%)`,
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
              <TransactionHistory
                transactions={filteredTransactions}
                months={monthsData}
                selectedMonth={selectedMonthData}
                onMonthChange={(m) => setSelectedMonth(m.label)}
                themeColor={goal.color || "#71d9d0"}
                title="Transaction History"
                onTransactionClick={(item) => {
                  setSelectedTransaction(item);
                  setShowDetailModal(true);
                }}
                productType="LFG"
                emptyMessage="No transactions available"
              />
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
                Rp
                {Number(
                  goalDetail.estimatedAccumulatedBalance || 0
                ).toLocaleString("id-ID")}
              </div>

              <div className="label">Initial Deposit</div>
              <div className="value">
                Rp
                {Number(goalDetail.initalDeposit || 0).toLocaleString("id-ID")}
              </div>

              <div className="label">Annual Interest Rate</div>
              <div className="value">
                {(Number(goalDetail.interestRate || 0) * 100)
                  .toFixed(2)
                  .replace(/\.00$/, "")}
                %
              </div>

              <div className="label">Duration</div>
              <div className="value">{goalDetail.lifegoalsDuration} years</div>

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