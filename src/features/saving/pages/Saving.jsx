import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import "../styles/saving.css";
import savingsIcon from "../../../assets/images/savings-icon.png";
import { getSavingsData } from "../api/savings.api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* Custom label using midAngle & outerRadius*/
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
  const [savingsData, setSavingsData] = useState(null);

  const [insightData] = useState({
    income: 10000000,
    expenses: 4000000,
    netIncome: 6000000,
    categories: [
      { name: "Food", amount: 2000000, percentage: 40 },
      { name: "Shopping", amount: 1750000, percentage: 35 },
      { name: "Others", amount: 1250000, percentage: 25 },
    ],
  });

  const fetchSavingsData = async () => {
    try {
      const userId = "USR001";
      const response = await getSavingsData(userId);

      const accounts = Array.isArray(response.data) ? response.data : [];

      const totalBalance = accounts.reduce(
        (sum, acc) => sum + acc.total_balance,
        0
      );

      const savings = accounts.flatMap((acc, index) =>
        acc.items.map((item) => ({
          id: index + 1,
          title: item.account_name,
          norekening: item.account_number,
          balance: item.effective_balance,
        }))
      );

      setSavingsData({
        totalBalance,
        totalCount: savings.length,
        savings,
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchSavingsData();
  }, []);

  // Prepare chart data and colors
  const COLOR_BY_NAME = {
    Food: "#9C7EDC",
    Shopping: "#FFE8B0",
    Others: "#CFBAD7",
  };

  const chartData = insightData.categories.map((c) => ({
    name: c.name,
    value: c.percentage, // use percentage for the pie values
    amount: c.amount,
    color: COLOR_BY_NAME[c.name] || "#ccc",
  }));

  return (
    <div className="savings-page-revamp">
      <Navbar />

      <main className="savings-main-container">
        {/* LEFT PANEL - Savings Information */}
        <section className="savings-left-section">
          <div className="section-header-block">
            <h2 className="section-main-title">Savings Information</h2>
            <p className="section-main-subtitle">
              Track your transaction history and payment information
            </p>
          </div>

          {/* Savings Summary Card */}
          <div className="savings-summary-box">
            <div className="summary-icon-area">
              <div className="summary-icon-bg">
                <img src={savingsIcon} alt="Savings Icon" className="summary-icon" />
              </div>
            </div>
            <div className="summary-text-area">
              <h3 className="summary-title-text">Your Savings</h3>
              <p className="summary-balance-label">Total Balance</p>
              <p className="summary-balance-amount">
                Rp{(savingsData?.totalBalance || 10000000).toLocaleString("id-ID")}
              </p>
              <p className="summary-balance-note">including held balance</p>
              <div className="summary-line-divider" />
              <p className="summary-accounts-info">
                You have {savingsData?.totalCount || 2} Account Numbers.
              </p>
            </div>
          </div>

          {/* Your Savings Accounts */}
          <div className="accounts-wrapper">
            <h3 className="accounts-main-title">Your Saving Accounts</h3>
            <div className="accounts-list">
              {savingsData?.savings?.map((s) => (
                <SavingsAccountCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL - Insight This Month */}
        <section className="insight-right-section">
          <div className="insight-header">
            <h2 className="section-main-title">Insight This Month</h2>
          </div>

          <div className="insight-main-box">
            {/* Income/Expenses/Net Income Cards */}
            <div className="insight-metrics-grid">
              <div className="metric-card metric-card-income">
                <h4 className="metric-label">Income</h4>
                <p className="metric-value metric-income">
                  + Rp{insightData.income.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="metric-card metric-card-expenses">
                <h4 className="metric-label">Expenses</h4>
                <p className="metric-value metric-expenses">
                  - Rp{insightData.expenses.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="metric-card metric-card-net">
                <h4 className="metric-label">Net Income</h4>
                <p className="metric-value metric-net-income">
                  + Rp{insightData.netIncome.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Transaction Category */}
            <div className="category-section">
              <h3 className="category-box-title">Your Transaction Category</h3>
              <p className="category-box-subtitle">Your expenses went to ....</p>

              <div className="category-display-grid">
                {/* Category List */}
                <div className="category-items-box">
                  {insightData.categories.map((cat, idx) => (
                    <div key={idx} className="category-row">
                      <span className="category-row-name">{cat.name}</span>
                      <div className="category-row-values">
                        <span className="category-row-amount">
                          Rp{cat.amount.toLocaleString("id-ID")}
                        </span>
                        <span className={`category-row-percent cat-color-${cat.name.toLowerCase()}`}>
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recharts Pie */}
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
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
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

/* Savings Account Card Component */
function SavingsAccountCard({ title, norekening, balance }) {
  return (
    <div className="account-item-card">
      <h4 className="account-item-title">{title}</h4>
      <p className="account-item-number">{norekening}</p>
      <p className="account-item-balance">
        Effective balance: <strong>Rp{balance.toLocaleString("id-ID")}</strong>
      </p>
    </div>
  );
}
