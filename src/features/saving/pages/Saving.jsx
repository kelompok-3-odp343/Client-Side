import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import "../styles/saving.css";
import savingsIcon from "../../../assets/images/savings-icon.png";
import { getSavingsOverview, getSavingsDetail } from "../api/savings.api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="1rem"
      fontWeight="800"
    >
      <tspan x={x} dy="-0.6em">{`${(percent * 100).toFixed(0)}%`}</tspan>
      <tspan x={x} dy="1.2em" fontSize="0.9rem" fontWeight="700">
        {name}
      </tspan>
    </text>
  );
};

export default function SavingsDashboard() {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);

  const loadSavingsOverview = async () => {
    try {
      const overview = await getSavingsOverview();
      const d = overview;

      if (!d) {
        throw new Error("Invalid overview data structure");
      }

      const accounts = d.accountList || [];

      setLeftData({
        totalBalance: d.targetAccountDetail?.Total_EffectiveBalance || 0,
        totalCount: accounts.length,
        savings: accounts.map((acc, i) => ({
          id: i + 1,
          title: acc.product_name,
          norekening: acc.account_number,
          name: acc.account_name,
          balance: acc.effective_balance_total,
          status: acc.account_status,
        })),
      });
    } catch (err) {
      console.error("Error getSavingsOverview:", err);
    }
  };

  const loadSavingsDetail = async () => {
    try {
      const detail = await getSavingsDetail();
      setRightData({
        income: detail.summary?.total_credit ?? 0,
        expenses: detail.summary?.total_debit ?? 0,
        netIncome: detail.summary?.net_growth ?? 0,
        categories:
          detail.category_breakdown?.map((c) => ({
            name: c.category,
            amount: c.total_amount,
            percentage: c.percent,
          })) || [],
      });
    } catch (err) {
      console.error("Error getSavingsDetail:", err);
    }
  };

  useEffect(() => {
    loadSavingsOverview();
    loadSavingsDetail();
  }, []);

  const chartData =
    rightData?.categories?.map((c) => ({
      name: c.name,
      value: c.percentage,
      amount: c.amount,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    })) || [];

  return (
    <div className="savings-page-revamp">
      <Navbar />

      <main className="savings-main-container">
        <section className="savings-left-section">
          <div className="section-header-block">
            <h2 className="section-main-title">Savings Information</h2>
            <p className="section-main-subtitle">
              Track your transaction history and payment information
            </p>
          </div>

          <div className="savings-summary-box">
            <div className="summary-icon-area">
              <div className="summary-icon-bg">
                <img src={savingsIcon} className="summary-icon" />
              </div>
            </div>

            <div className="summary-text-area">
              <h3 className="summary-title-text">Your Savings</h3>
              <p className="summary-balance-label">Total Balance</p>

              <p className="summary-balance-amount">
                Rp{(leftData?.totalBalance ?? 0).toLocaleString("id-ID")}
              </p>
              <p className="summary-balance-note">including held balance</p>

              <div className="summary-line-divider" />

              <p className="summary-accounts-info">
                You have {leftData?.totalCount ?? 0} Account Numbers.
              </p>
            </div>
          </div>

          <div className="accounts-wrapper">
            <h3 className="accounts-main-title">Your Saving Accounts</h3>
            <div className="accounts-list">
              {leftData?.savings?.map((s) => (
                <SavingsAccountCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        </section>

        <section className="insight-right-section">
          <div className="insight-header">
            <h2 className="section-main-title">Insight This Month</h2>
          </div>

          <div className="insight-main-box">
            <div className="insight-metrics-grid">
              <div className="metric-card metric-card-income">
                <h4 className="metric-label">Income</h4>
                <p className="metric-value metric-income">
                  + Rp{(rightData?.income ?? 0).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="metric-card metric-card-expenses">
                <h4 className="metric-label">Expenses</h4>
                <p className="metric-value metric-expenses">
                  - Rp{(rightData?.expenses ?? 0).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="metric-card metric-card-net">
                <h4 className="metric-label">Net Income</h4>
                <p className="metric-value metric-net-income">
                  Rp{(rightData?.netIncome ?? 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="category-section">
              <h3 className="category-box-title">Your Transaction Category</h3>
              <p className="category-box-subtitle">Your expenses went to...</p>

              <div className="category-display-grid">

                {/* Category List */}
                <div className="category-items-box">
                  {rightData?.categories?.map((cat, idx) => (
                    <div key={idx} className="category-row">
                      <span className="category-row-name">{cat.name}</span>
                      <div className="category-row-values">
                        <span className="category-row-amount">
                          Rp{cat.amount.toLocaleString("id-ID")}
                        </span>
                        <span className="category-row-percent">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pie-chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        labelLine={false}
                        isAnimationActive={false}
                        label={renderCustomLabel}
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

function SavingsAccountCard({ title, norekening, balance, name, status }) {
  return (
    <div className="account-item-card">
      <h4 className="account-item-title">{title}</h4>
      <p className="account-item-number">{norekening} - {name}</p>
      <p className="account-item-balance">
        Effective balance: <strong>Rp{balance.toLocaleString("id-ID")}</strong>
      </p>

      <p className="account-item-status">Status: {status}</p>
    </div>
  );
}
