import React, { useState, useEffect } from "react";
import Navbar from "../../../shared/components/Navbar";
import { ChartPie, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { fetchCards } from "../api/dashboard.api.js";
import depositsIcon from "../../../assets/images/dashboard-deposits-icon.png";
import savingsIcon from "../../../assets/images/dashboard-savings-icon.png";
import lifeGoalsIcon from "../../../assets/images/dashboard-life-goals-icon.png";
import dplkIcon from "../../../assets/images/dashboard-dplk-icon.png";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // fetch dashboard data
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "dummyUser123";
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        if (API_BASE_URL) {
          const resp = await fetch(
            `${API_BASE_URL}/api/v1/dashboard?user_id=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (!resp.ok) throw new Error("API error");
          const json = await resp.json();
          setData(json.data);
        } else {
          setData({
            assets_total: { total: 50580062, extra_this_month: 7000000 },
            earnings_overview: { income: 17580062, expenses: 10580062 },
            split: {
              paid: 12000000,
              remaining: 3000000,
              total: 15000000,
              progress: 80,
              potential: 20580062,
              ongoing: 4,
            },
            time_deposits: { total_balance: 15000000, count_accounts: 2 },
            savings: [],
            pension_funds: [],
            life_goals: [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // fetch cards
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "dummyUser123";
    const token = localStorage.getItem("token");
    const getCards = async () => {
      const result = await fetchCards(userId, token);
      setCards(result);
    };
    getCards();
  }, []);

  // auto slide
  useEffect(() => {
    if (!cards.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [cards]);

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
                    The remaining bill that can be collected is <strong>Rp{fmt(split?.remaining ?? 0)}</strong>
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
                    0,
                  ) ?? 0,
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
                  pension_funds?.reduce((s, p) => s + (p.balance || 0), 0) ?? 0,
                )}
              </div>
            </div>
            <img className="pill-img" src={dplkIcon} alt="Pension Funds Icon" />
          </button>
        </section>

        {/* ========== MY CARDS & EARNINGS ========== */}
        <section className="bottom-grid">
          {/* MY CARDS */}
          <div className="card cards-panel">
            <div className="cards-layout">
              {/* LEFT SIDE TEXT */}
              <div className="cards-info">
                <h3>My Cards</h3>
                {cards.length > 0 && (
                  <p className="cards-sub">{cards.length} Active Cards</p>
                )}
                <p className="cards-tip">
                  Tap a card to see history and manage split bill
                </p>
              </div>

              {/* RIGHT SIDE CARD SLIDER */}
              <div className="auto-slider">
                {cards.length > 0 ? (
                  <>
                    <div
                      key={cards[currentIndex]?.account_id}
                      className="bank-card slide-in"
                      onClick={() => navigate("/detailmycard")}
                    >
                      <div className="card-header">
                        <span className="bank-type">
                          {cards[currentIndex]?.type} – {cards[currentIndex]?.account_number}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="card-number-row">
                          <p className="card-number">
                            {cards[currentIndex]?.showCardNumber
                              ? (cards[currentIndex]?.card_number ?? "")
                                  .replace(/(\d{4})(?=\d)/g, "$1 ")
                              : "**** **** **** " +
                                String(cards[currentIndex]?.card_number ?? "").slice(-4)}
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

          {/* EARNINGS OVERVIEW */}
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
                      (income / Math.max(1, income + expenses)) * 200,
                    )}px`,
                  }}
                />
                <div
                  className="bar expense-bar"
                  style={{
                    height: `${Math.round(
                      (expenses / Math.max(1, income + expenses)) * 200,
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