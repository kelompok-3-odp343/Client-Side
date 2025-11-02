import React, { useState, useEffect } from "react";
import Navbar from "../../../shared/components/Navbar";
import { ChartPie, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { fetchDashboard } from "../api/dashboard.api.js";
import depositsIcon from "../../../assets/images/dashboard-deposits-icon.png";
import savingsIcon from "../../../assets/images/dashboard-savings-icon.png";
import lifeGoalsIcon from "../../../assets/images/dashboard-life-goals-icon.png";
import dplkIcon from "../../../assets/images/dashboard-dplk-icon.png";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const dataDashboards = async () => {
      try {
        const raw = await fetchDashboard();
        const d = raw?.data;

        if (!d) {
          console.warn("⚠️ Dashboard dummy digunakan karena data kosong.");
          setLoading(false);
          return;
        }

        const total = d.assetoverview?.totalAsset ?? 0;
        const income = d.cashFlowOverview?.totalIncome ?? 0;
        const expenses = d.cashFlowOverview?.totalExpense ?? 0;
        const receivable = d.cashFlowOverview?.totalReceivable ?? 0;

        const totalBill = d.splitBillOverview?.totalBillAmount ?? 0;
        const remainingBill = d.splitBillOverview?.remainingBillAmount ?? 0;
        const paidBill = totalBill - remainingBill;
        const progress =
          totalBill > 0 ? Math.round((paidBill / totalBill) * 100) : 0;

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

        const mappedCards = (d.accountList ?? []).map((item) => ({
          type: item.account_product_name,
          account_number: item.account_number,
          card_number: item.debit_card_number || item.account_number,
          account_holder_name: item.account_name,
          showCardNumber: false,
        }));

        setCards(mappedCards);
      } finally {
        setLoading(false);
      }

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

      const mappedCards = (d.accountList ?? []).map((item) => ({
        type: item.accountProductName,
        account_number: item.accountNumber,
        card_number: item.debit_card_number || item.accountNumber,
        account_holder_name: item.accountName,
        effective_balance: item.effectiveBalance,
        showCardNumber: false,
      }));
      setCards(mappedCards);
      console.log('zxccc', d.accountList);


      setLoading(false);
    };

    dataDashboards();
  }, []);

  // === AUTO SLIDE UNTUK CARD ===
  useEffect(() => {
    if (cards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [cards]);

  // === Manual slide controls ===
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="empty">No data found</div>;

  const {
    assets_total,
    earnings_overview,
    split,
    time_deposits,
    savings,
    pension_funds,
    life_goals,
  } = data;

  const income = earnings_overview?.income ?? 0;
  const expenses = earnings_overview?.expenses ?? 0;
  const assets = assets_total?.total ?? 0;
  const splitProgress = split?.progress ?? 0;

  const fmt = (v) => Number(v).toLocaleString("id-ID");
  const handleNavigate = (section) => navigate(`/${section}`);

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        <h2 className="page-title">Dashboard</h2>

        {/* ========== TOP GRID ========== */}
        <section className="top-grid">
          <div className="card card-gradient assets-card">
            <div className="card-head">
              <h3>Assets Total</h3>
            </div>
            <div className="card-body">
              <h1>Rp{fmt(assets)}</h1>
              <p className="muted">
                You made extra Rp{fmt(assets_total?.extra_this_month ?? 0)} this
                month
              </p>
            </div>
          </div>

          <div className="card income-card">
            <h3>Income & Expenses</h3>
            <div className="small-cards">
              <div className="small-card small-card--income">
                <div className="small-card-icon">
                  <ChartPie />
                </div>
                <div className="small-card-info">
                  <div className="small-title">+ Rp{fmt(income)}</div>
                  <div className="small-sub">Total income this month</div>
                </div>
              </div>
              <div className="small-card small-card--expense">
                <div className="small-card-icon">
                  <ChartPie />
                </div>
                <div className="small-card-info">
                  <div className="small-title">- Rp{fmt(expenses)}</div>
                  <div className="small-sub">Total expenses this month</div>
                </div>
              </div>
              <div className="small-card small-card--receivable">
                <div className="small-card-icon">
                  <ChartPie />
                </div>
                <div className="small-card-info">
                  <div className="small-title">
                    + Rp{fmt(split?.remaining ?? 0)}
                  </div>
                  <div className="small-sub">Total receivable this month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card split-card">
            <h3>Split Bills</h3>
            <div className="split-content">
              <div className="split-left">
                <div
                  className="donut"
                  style={{
                    background: `conic-gradient(#6dddd0 ${splitProgress * 3.6}deg, #e6f0ef 0deg)`,
                  }}
                >
                  <div className="donut-center">{splitProgress}%</div>
                </div>
                <div className="split-progress">
                  Rp{fmt(split?.paid ?? 0)} / Rp{fmt(split?.total ?? 0)}
                </div>
              </div>

              <div className="split-info">
                <div className="info-panel">
                  <div className="panel-ttl">
                    You have {split?.ongoing ?? 0} ongoing split bills
                  </div>
                  <div className="panel-sub">
                    The remaining bill that can be collected is{" "}
                    <strong>Rp{fmt(split?.remaining ?? 0)}</strong>
                  </div>
                  <div className="potential">
                    Your potential asset accumulation:
                  </div>
                  <div className="potential-value">
                    Rp{fmt(split?.potential ?? 0)}
                  </div>
                  <a
                    href="#"
                    className="view-detail"
                    onClick={() => handleNavigate("splitbill")}
                  >
                    View Detail
                  </a>
                </div>
                <button
                  className="btn-add"
                  onClick={() => handleNavigate("detailMyCard")}
                >
                  + Add a New Bill
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FUND PILLS ========== */}
        <section className="fund-pills">
          <button
            className="pill"
            onClick={() => handleNavigate("deposits")}
            style={{ backgroundColor: "#FFE8B0" }}
          >
            <div className="pill-text">
              <div className="pill-title">Time Deposits</div>
              <div className="pill-amount">
                Rp{fmt(time_deposits?.total_balance ?? 0)}
              </div>
            </div>
            <img className="pill-img" src={depositsIcon} alt="Deposits Icon" />
          </button>

          <button
            className="pill"
            onClick={() => handleNavigate("savings")}
            style={{ backgroundColor: "#FFE8B0" }}
          >
            <div className="pill-text">
              <div className="pill-title">Savings</div>
              <div className="pill-amount">
                Rp{fmt(savings?.[0]?.total_balance ?? 0)}
              </div>
            </div>
            <img className="pill-img" src={savingsIcon} alt="Savings Icon" />
          </button>

          <button
            className="pill"
            onClick={() => handleNavigate("lifegoals")}
            style={{ backgroundColor: "#FFE8B0" }}
          >
            <div className="pill-text">
              <div className="pill-title">Life Goals</div>
              <div className="pill-amount">
                Rp
                {fmt(
                  life_goals?.reduce(
                    (s, g) => s + (g.current_savings || 0),
                    0
                  ) ?? 0
                )}
              </div>
            </div>
            <img className="pill-img" src={lifeGoalsIcon} alt="Life Goals Icon" />
          </button>

          <button
            className="pill"
            onClick={() => handleNavigate("pensionfunds")}
            style={{ backgroundColor: "#FFE8B0" }}
          >
            <div className="pill-text">
              <div className="pill-title">Pension Funds</div>
              <div className="pill-amount">
                Rp
                {fmt(
                  pension_funds?.reduce(
                    (s, p) => s + (p.balance || 0),
                    0
                  ) ?? 0
                )}
              </div>
            </div>
            <img className="pill-img" src={dplkIcon} alt="Pension Funds Icon" />
          </button>
        </section>

        {/* ========== MY CARDS & EARNINGS ========== */}
        <section className="bottom-grid">
          <div className="card cards-panel">
            <div className="cards-layout">
              <div className="cards-info">
                <h3>My Cards</h3>
                {cards.length > 0 && (
                  <p className="cards-sub">{cards.length} Active Cards</p>
                )}
                <p className="cards-tip">
                  Tap a card to see history and manage split bill
                </p>
              </div>

              <div className="auto-slider">
                {cards.length > 0 ? (
                  <>
                    <button
                      className="nav-arrow left-arrow"
                      onClick={handlePrev}
                      aria-label="Previous Card"
                    >
                      <ChevronLeft size={28} />
                    </button>

                    <div
                      key={cards[currentIndex]?.account_number}
                      className="bank-card slide-in"
                      onClick={() => navigate("/detailmycard", { state: { cards } })}
                    >
                      <div className="card-header">
                        <span className="bank-type">
                          {cards[currentIndex]?.type} –{" "}
                          {cards[currentIndex]?.account_number}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="card-number-row">
                          <p className="card-number">
                            {cards[currentIndex]?.showCardNumber
                              ? (cards[currentIndex]?.card_number ?? "").replace(
                                /(\d{4})(?=\d)/g,
                                "$1 "
                              )
                              : "**** **** **** " +
                              String(
                                cards[currentIndex]?.card_number ?? ""
                              ).slice(-4)}
                          </p>
                          <span
                            className="eye-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = [...cards];
                              updated[currentIndex].showCardNumber =
                                !updated[currentIndex].showCardNumber;
                              setCards(updated);
                            }}
                          >
                            {cards[currentIndex]?.showCardNumber ? (
                              <EyeOff size={18} strokeWidth={2.5} />
                            ) : (
                              <Eye size={18} strokeWidth={2.5} />
                            )}
                          </span>
                        </div>

                        <p className="card-holder">
                          {cards[currentIndex]?.account_holder_name ?? ""}
                        </p>
                      </div>
                    </div>

                    <button
                      className="nav-arrow right-arrow"
                      onClick={handleNext}
                      aria-label="Next Card"
                    >
                      <ChevronRight size={28} />
                    </button>

                    <div className="dots">
                      {cards.map((_, i) => (
                        <span
                          key={i}
                          className={`dot ${i === currentIndex ? "active" : ""}`}
                        />
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
                <div className="earn-cell">
                  <div className="earn-value">Rp{fmt(income)}</div>
                  <div className="earn-label">Income</div>
                </div>
                <div className="earn-cell">
                  <div className="earn-value">Rp{fmt(expenses)}</div>
                  <div className="earn-label">Expenses</div>
                </div>
              </div>
              <div className="bar-chart">
                <div
                  className="bar income-bar"
                  style={{
                    height: `${Math.round(
                      (income / Math.max(1, income + expenses)) * 200
                    )}px`,
                  }}
                />
                <div
                  className="bar expense-bar"
                  style={{
                    height: `${Math.round(
                      (expenses / Math.max(1, income + expenses)) * 200
                    )}px`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}