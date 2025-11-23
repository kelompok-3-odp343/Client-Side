import React, { useState, useEffect } from "react";
import Navbar from "../../../shared/components/Navbar";
import { ChartPie, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { fetchDashboard } from "../api/dashboard.api.js";
import { fetchAllCards } from "../../card/api/card.api.js";
import depositsIcon from "../../../assets/images/dashboard-deposits-icon.png";
import savingsIcon from "../../../assets/images/dashboard-savings-icon.png";
import lifeGoalsIcon from "../../../assets/images/dashboard-life-goals-icon.png";
import dplkIcon from "../../../assets/images/dashboard-dplk-icon.png";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const dataDashboards = async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchDashboard();
        const cardsData = await fetchAllCards();

        const d = raw.data;
        const total = d.assetoverview?.totalAsset ?? 0;
        const income = d.cashFlowOverview?.totalIncome ?? 0;
        const expenses = d.cashFlowOverview?.totalExpense ?? 0;
        const receivable = d.cashFlowOverview?.totalReceivable ?? 0;

        const totalBill = d.splitBillOverview?.totalBillAmount ?? 0;
        const remainingBill = d.splitBillOverview?.remainingBillAmount ?? 0;
        const paidBill = totalBill - remainingBill;
        const progress = totalBill > 0 ? Math.round((paidBill / totalBill) * 100) : 0;

        const pf = d.portfolioOverview ?? [];
        const amt = (name) =>
          pf.find((p) => p.productName === name)?.totalAmount ?? 0;

        setData({
          assets_total: { total, extra_this_month: 0 },
          earnings_overview: { income, expenses },
          split: {
            paid: paidBill,
            remaining: remainingBill,
            total: totalBill,
            progress,
            potential: receivable,
            ongoing: d.splitBillOverview?.countSplitBill ?? 0,
          },
          time_deposits: { total_balance: amt("timeDeposit") },
          savings: [{ total_balance: amt("accountSavings") }],
          life_goals: [{ current_savings: amt("lifegoals") }],
          pension_funds: [{ balance: amt("dplk") }],
        });

        if (Array.isArray(cardsData) && cardsData.length > 0) {
          const mappedCards = cardsData.map((item) => ({
            account_id: item.account_id,
            type: item.type || item.productName || "Tabungan",
            account_number: item.accountNumber || item.account_number,
            account_holder_name: item.accountName || item.account_holder_name,
            effective_balance: item.effectiveBalance !== undefined ? item.effectiveBalance : item.effective_balance,
            is_main: item.is_main,
            showBalance: false,
          }));
          setCards(mappedCards);
        } else {
          const mappedCards = (d.accountList ?? []).map((item) => ({
            type: item.accountProductName || "ACCOUNT NUMBER",
            account_number: item.accountNumber,
            card_number: item.debit_card_number || item.accountNumber,
            account_holder_name: item.accountName,
            effective_balance: item.effectiveBalance,
            is_main: false,
            showCardNumber: false,
          }));
          setCards(mappedCards);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    dataDashboards();
  }, []);

  useEffect(() => {
    if (cards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [cards]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handleCardClick = () => {
    navigate("/detailmycard", { state: { cards, selectedAccount: cards[currentIndex]?.account_number } });
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  if (error) return (
    <div className="dashboard-page">
      <Navbar />
      <div className="error-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Failed to Load Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  if (!data) return (
    <div className="dashboard-page">
      <Navbar />
      <div className="empty" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>No Data Available</h2>
        <p>Unable to load dashboard information</p>
      </div>
    </div>
  );

  const { assets_total, earnings_overview, split, time_deposits, savings, pension_funds, life_goals } = data;
  const income = earnings_overview?.income ?? 0;
  const expenses = earnings_overview?.expenses ?? 0;
  const assets = assets_total?.total ?? 0;
  const splitProgress = split?.progress ?? 0;
  const fmt = (v) => Number(v).toLocaleString("id-ID");
  const handleNavigate = (section) => navigate(`/${section}`);
  const currentCard = cards[currentIndex];

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        <h2 className="page-title">Dashboard</h2>

        <section className="top-grid">
          <div className="card card-gradient assets-card">
            <div className="card-head"><h3>Assets Total</h3></div>
            <div className="card-body">
              <h1>Rp{fmt(assets)}</h1>
              <p className="muted">You made extra Rp{fmt(assets_total?.extra_this_month ?? 0)} this month</p>
            </div>
          </div>

          <div className="card income-card">
            <h3>Income & Expenses</h3>
            <div className="small-cards">
              <div className="small-card small-card--income">
                <div className="small-card-icon"><ChartPie /></div>
                <div className="small-card-info">
                  <div className="small-title">+ Rp{fmt(income)}</div>
                  <div className="small-sub">Total income this month</div>
                </div>
              </div>
              <div className="small-card small-card--expense">
                <div className="small-card-icon"><ChartPie /></div>
                <div className="small-card-info">
                  <div className="small-title">- Rp{fmt(expenses)}</div>
                  <div className="small-sub">Total expenses this month</div>
                </div>
              </div>
              <div className="small-card small-card--receivable">
                <div className="small-card-icon"><ChartPie /></div>
                <div className="small-card-info">
                  <div className="small-title">+ Rp{fmt(split?.remaining ?? 0)}</div>
                  <div className="small-sub">Total receivable this month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card split-card">
            <h3>Split Bills</h3>
            <div className="split-content">
              <div className="split-left">
                <div className="donut" style={{ background: `conic-gradient(#6dddd0 ${splitProgress * 3.6}deg, #e6f0ef 0deg)` }}>
                  <div className="donut-center">{splitProgress}%</div>
                </div>
                <div className="split-progress">Rp{fmt(split?.paid ?? 0)} / Rp{fmt(split?.total ?? 0)}</div>
              </div>
              <div className="split-info">
                <div className="info-panel">
                  <div className="panel-ttl">You have {split?.ongoing ?? 0} ongoing split bills</div>
                  <div className="panel-sub">The remaining bill that can be collected is <strong>Rp{fmt(split?.remaining ?? 0)}</strong></div>
                  <div className="potential">Your potential asset accumulation:</div>
                  <div className="potential-value">Rp{fmt(split?.potential ?? 0)}</div>
                  <a href="#" className="view-detail" onClick={() => handleNavigate("splitbill")}>View Detail</a>
                </div>
                <button className="btn-add" onClick={() => navigate("/detailmycard", { state: { cards } })}>+ Add a New Bill</button>
              </div>
            </div>
          </div>
        </section>

        <section className="fund-pills">
          <button className="pill" onClick={() => handleNavigate("deposits")} style={{ backgroundColor: "#FFE8B0" }}>
            <div className="pill-text"><div className="pill-title">Time Deposits</div><div className="pill-amount">Rp{fmt(time_deposits?.total_balance ?? 0)}</div></div>
            <img className="pill-img" src={depositsIcon} alt="Deposits" />
          </button>
          <button className="pill" onClick={() => handleNavigate("savings")} style={{ backgroundColor: "#FFE8B0" }}>
            <div className="pill-text"><div className="pill-title">Savings</div><div className="pill-amount">Rp{fmt(savings?.[0]?.total_balance ?? 0)}</div></div>
            <img className="pill-img" src={savingsIcon} alt="Savings" />
          </button>
          <button className="pill" onClick={() => handleNavigate("lifegoals")} style={{ backgroundColor: "#FFE8B0" }}>
            <div className="pill-text"><div className="pill-title">Life Goals</div><div className="pill-amount">Rp{fmt(life_goals?.reduce((s, g) => s + (g.current_savings || 0), 0) ?? 0)}</div></div>
            <img className="pill-img" src={lifeGoalsIcon} alt="Life Goals" />
          </button>
          <button className="pill" onClick={() => handleNavigate("pensionfunds")} style={{ backgroundColor: "#FFE8B0" }}>
            <div className="pill-text"><div className="pill-title">Pension Funds</div><div className="pill-amount">Rp{fmt(pension_funds?.reduce((s, p) => s + (p.balance || 0), 0) ?? 0)}</div></div>
            <img className="pill-img" src={dplkIcon} alt="Pension Funds" />
          </button>
        </section>

        <section className="bottom-grid">
          <div className="card cards-panel">
            <div className="cards-layout">
              <div className="cards-info">
                <h3>My Cards</h3>
                {cards.length > 0 && <p className="cards-sub">{cards.length} Active Cards</p>}
                <p className="cards-tip">Tap a card to see history and manage split bill</p>
              </div>

              <div className="auto-slider">
                {cards.length > 0 ? (
                  <>
                    <button className="nav-arrow left-arrow" onClick={handlePrev} aria-label="Previous Card"><ChevronLeft size={28} /></button>

                    <div
                      key={currentIndex}
                      className="bank-card slide-in"
                      onClick={handleCardClick}
                    >
                      <div className="bank-card-header">
                        <div className="bank-card-details">
                          <p className="bank-card-type">
                            {currentCard?.type || "Tabungan"}
                          </p>
                          <p className="bank-card-number">
                            {currentCard?.account_number
                              ? String(currentCard.account_number).replace(/(.{4})/g, "$1 ").trim()
                              : "---- ---- ----"}
                          </p>
                        </div>

                        {currentCard?.is_main && (
                          <div className="bank-card-badge">
                            <span>Main Account</span>
                          </div>
                        )}
                      </div>

                      <div className="bank-card-footer">
                        <p className="bank-card-label">Effective Balance</p>
                        <div className="bank-card-balance-row">
                          <h3>
                            {currentCard?.showBalance
                              ? `Rp ${fmt(currentCard?.effective_balance ?? 0)}`
                              : "Rp •••••••••"}
                          </h3>
                          <span
                            className="eye-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = [...cards];
                              updated[currentIndex].showBalance = !updated[currentIndex].showBalance;
                              setCards(updated);
                            }}
                          >
                            {currentCard?.showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="nav-arrow right-arrow" onClick={handleNext} aria-label="Next Card"><ChevronRight size={28} /></button>
                    <div className="dots">
                      {cards.map((_, i) => (
                        <span key={i} className={`dot ${i === currentIndex ? "active" : ""}`} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bank-card empty-card">No active cards</div>
                )}
              </div>
            </div>
          </div>

          <div className="card earnings-panel">
            <h3>Earnings Overview</h3>
            <div className="earnings-charts">
              <div className="earn-summary">
                <div className="earn-cell"><div className="earn-value">Rp{fmt(income)}</div><div className="earn-label">Income</div></div>
                <div className="earn-cell"><div className="earn-value">Rp{fmt(expenses)}</div><div className="earn-label">Expenses</div></div>
              </div>
              <div className="bar-chart">
                <div className="bar income-bar" style={{ height: `${Math.round((income / Math.max(1, income + expenses)) * 200)}px` }} />
                <div className="bar expense-bar" style={{ height: `${Math.round((expenses / Math.max(1, income + expenses)) * 200)}px` }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}