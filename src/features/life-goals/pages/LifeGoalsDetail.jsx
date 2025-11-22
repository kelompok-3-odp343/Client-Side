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
import { ChevronLeft } from "lucide-react";

export default function LifeGoalDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const goal = state?.goal || {};
  const accountNumber = state?.accountNumber;

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

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);

  const [transactions, setTransactions] = useState([]);
  const [goalDetail, setGoalDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const mapTransactions = (txData) => {
    if (!Array.isArray(txData)) return [];
    
    return txData.map(group => ({
      date: new Date(group.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      items: group.items.map((item, idx) => ({
        transactionId: item.transactionId || `LFG-${idx}`,
        transactionDate: group.date,
        type: item.type,
        transactionType: item.type,
        detail: item.desc,
        partyName: item.type,
        amount: item.amount,
        debit_credit: String(item.amount).startsWith("-") ? "D" : "C",
        jenisTransaksi: String(item.amount).startsWith("-") ? "Expense" : "Income",
      }))
    }));
  };

  useEffect(() => {
    async function loadData() {
      if (!accountNumber) return;
      setLoading(true);
      
      try {
        const detailRes = await fetchLifeGoalDetail(accountNumber);
        setGoalDetail(detailRes?.data || null);

        await handleMonthChange(selectedMonth);
      } catch (error) {
        console.error(error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [accountNumber]);

  // Handle perubahan bulan
  const handleMonthChange = async (monthObj) => {
    setSelectedMonth(monthObj);
    setLoading(true);
    try {
        const txRes = await fetchLifeGoalTransactions(
            accountNumber, 
            monthObj.month, 
            monthObj.year
        );
        setTransactions(mapTransactions(txRes));
    } catch (err) {
        setTransactions([]);
    } finally {
        setLoading(false);
    }
  };

  if (!goalDetail) return <div className="loading">Loading...</div>;

  const toDate = (str) => {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d;
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
        "--theme": goal.color || "#6dddd0",
        "--accent-gradient": `linear-gradient(135deg, ${
          goal.color || "#6dddd0"
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
            <ChevronLeft size={24} className="back-icon" />
            Back to Life Goals
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
                transactions={transactions} 
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange} 
                themeColor={goal.color || "#71d9d0"}
                title="Transaction History"
                loading={loading}
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
            <div className="lg-info-grid">
              <h3 className="info-title">Life Goal Details</h3>
              <div className="divider" />
              <div className="lg-label">Account Number</div>
              <div className="lg-value">{goalDetail.accountNumber}</div>

              <div className="lg-label">Estimated Accumulated Funds</div>
              <div className="lg-value">
                Rp
                {Number(goalDetail.estimatedAccumulatedBalance || 0).toLocaleString("id-ID")}
              </div>

              <div className="lg-label">Initial Deposit</div>
              <div className="lg-value">
                Rp
                {Number(goalDetail.initalDeposit || 0).toLocaleString("id-ID")}
              </div>

              <div className="lg-label">Annual Interest Rate</div>
              <div className="lg-value">
                {(Number(goalDetail.interestRate || 0) * 100).toFixed(2).replace(/\.00$/, "")}%
              </div>

              <div className="lg-label">Duration</div>
              <div className="lg-value">{goalDetail.lifegoalsDuration} years</div>

              <div className="lg-label">Created On</div>
              <div className="lg-value">
                {(() => {
                  const d = toDate(goalDetail.createdTime);
                  return d instanceof Date ? d.toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
                })()}
              </div>

              <h3 className="info-title">Disbursement Details</h3>
              <div className="divider" />

              <div className="lg-label">Maturity Date</div>
              <div className="lg-value">
                {(() => {
                   const d = toDate(goalDetail.maturityDate);
                   return d instanceof Date ? d.toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
                })()}
              </div>

              <div className="lg-label">Disbursement Account</div>
              <div className="lg-value">
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