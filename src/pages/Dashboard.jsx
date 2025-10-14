import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../css/globals.css";
// import { DUMMY_CARDS } from "../data/dummy";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      userId = "dummyUser123";
      localStorage.setItem("userId", userId);
    }

    const fetchData = async () => {
      try {
        if (API_BASE_URL) {
          const resp = await fetch(
            `${API_BASE_URL}/api/v1/dashboard?user_id=${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!resp.ok) throw new Error("API error");
          const json = await resp.json();
          // expect server's structure; adapt if necessary
          setData(json.data);
        } else {
          // dummy fallback data to show UI
          setData({
            meta: { user_id: "USR001", name: "Ulion Pardede", currency: "IDR" },
            assets_total: { total: 17580062, extra_this_month: 20000 },
            earnings_overview: { income: 17580062, expenses: 10580062 },
            split: {
              progress: 100,
              remaining: 2000000,
              potential: 32580062,
              ongoing: 4,
            },
            time_deposits: { total_balance: 15000000, count_accounts: 2 },
            savings: [
              {
                group_id: "SAV_001",
                title: "Savings - TAPLUS BISNIS",
                total_balance: 12000000000,
                items: [
                  {
                    account_id: "ACCT_1",
                    account_number: "1234567890",
                    balance: 8000000000,
                    currency_code: "IDR"
                  },
                  {
                    account_id: "ACCT_2",
                    account_number: "1234567891",
                    balance: 4000000000,
                    currency_code: "IDR"
                  }
                ]
              }
            ],
            pension_funds: [
              {
                group_id: "PF_001",
                title: "Pension Fund - DPLK BNI",
                total_balance: 15000000,
                items: [
                  {
                    account_id: "DPLK_0001",
                    deposit_account_number: "DPLK12345",
                    balance: 15000000,
                    maturity_date: "2026-06-01",
                    currency_code: "IDR"
                  }
                ]
              }
            ],
            life_goals: [
              {
                goal_group_id: "LG_023",
                title: "Life Goals",
                total_balance: 50000000,
                goals: [
                  {
                    goal_id: "LG_023",
                    name: "Education",
                    current_savings: 50000000,
                    target: 100000000
                  }
                ]
              }
            ],
            cards: {
              active_count: 3,
              list: [
                {
                  account_id: "ACCT001",
                  type: "TAPLUS BISNIS",
                  account_number: "12345678910",
                  effective_balance: 50000000,
                },
                {
                  account_id: "ACCT001",
                  type: "TEST 1",
                  account_number: "12345678910",
                  effective_balance: 40000000,
                },
                {
                  account_id: "ACCT001",
                  type: "TEST 2",
                  account_number: "12345678910",
                  effective_balance: 30000000,
                },
              ],
            },
            recent_trx_summary: { latest_items: [] },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          meta: { user_id: "offline", name: "Offline User", currency: "IDR" },
          assets_total: { total: 10000000, extra_this_month: 0 },
          earnings_overview: { income: 8000000, expenses: 3000000 },
          split: {
            progress: 60,
            remaining: 500000,
            potential: 15000000,
            ongoing: 2,
          },
          time_deposits: { total_balance: 15000000, count_accounts: 1 },
          savings: [],
          pension_funds: [],
          life_goals: [],
          cards: {
            active_count: 0,
            list: [],
          },
          recent_trx_summary: { latest_items: [] },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

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
    cards,
  } = data;


  // const cardsList = (cards?.list && cards.list.length) ? cards.list : DUMMY_CARDS;

  const income = earnings_overview?.income ?? 0;
  const expenses = earnings_overview?.expenses ?? 0;
  const assets = assets_total?.total ?? 0;
  const splitProgress = split?.progress ?? 0;

  const sliderRefScroll = sliderRef;

  const scrollLeft = () =>
    sliderRefScroll.current?.scrollBy({ left: -260, behavior: "smooth" });
  const scrollRight = () =>
    sliderRefScroll.current?.scrollBy({ left: 260, behavior: "smooth" });

  const handleNavigate = (section) => navigate(`/${section}`);

  // simple money formatting
  const fmt = (v) => {
    try {
      return Number(v).toLocaleString("id-ID");
    } catch {
      return v;
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <h2 className="page-title">Dashboard</h2>

        {/* Top grid: Assets | Income & Expenses | Split Bills */}
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
                <div className="small-title">+ Rp{fmt(income)}</div>
                <div className="small-sub">Total income this month</div>
              </div>
              <div className="small-card small-card--expense">
                <div className="small-title">- Rp{fmt(expenses)}</div>
                <div className="small-sub">Total expenses this month</div>
              </div>
              <div className="small-card small-card--receivable">
                <div className="small-title">+ Rp{fmt(income)}</div>
                <div className="small-sub">Total receivable this month</div>
              </div>
            </div>
          </div>

          <div className="card split-card">
            <h3>Split Bills</h3>

            <div className="split-content">
              <div
                className="donut"
                style={{
                  background: `conic-gradient(#36D1B3 ${splitProgress * 3.6
                    }deg, #e6f0ef 0deg)`,
                }}
              >
                <div className="donut-center">{splitProgress}%</div>
              </div>

              <div className="split-info">
                <div className="info-panel">
                  <div className="panel-top">
                    <div className="panel-ttl">
                      You have {split?.ongoing ?? 0} ongoing split bills
                    </div>
                    <div className="panel-sub">
                      The remaining bill that can be collected is IDR Rp
                      {fmt(split?.remaining ?? 0)}
                    </div>
                  </div>
                  <div className="panel-bottom">
                    <div className="potential">
                      Your potential asset accumulation:
                    </div>
                    <div className="potential-value">
                      Rp{fmt(split?.potential ?? 0)}
                    </div>
                    <a href="#" className="view-detail">
                      View Detail
                    </a>
                  </div>
                </div>
                <button
                  className="btn-add"
                  onClick={() => handleNavigate("splitbill")}
                >
                  + Add a New Bill
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Fund pills (Time Deposits, Savings, Life Goals, Pension Funds) */}
        <section className="fund-pills">
          <button className="pill" onClick={() => handleNavigate("deposits")} style={{backgroundColor: "#FFE8B0"}}>
            <div className="pill-text">
              <div className="pill-title">Time Deposits</div>
              <div className="pill-amount">
                Rp{fmt(time_deposits?.total_balance ?? 0)}
              </div>
            </div>
            <img className="pill-img"src="" alt="" />
          </button>

          <button className="pill" onClick={() => handleNavigate("savings")} style={{backgroundColor: "#FFE8B0"}}>
            <div className="pill-text">
              <div className="pill-title">Savings</div>
              <div className="pill-amount">
                Rp{fmt(savings?.[0]?.total_balance ?? 0)}
              </div>
            </div>
            <img className="pill-img"src="" alt="" />

          </button>

          <button className="pill" onClick={() => handleNavigate("lifegoals")} style={{backgroundColor: "#FFE8B0"}}>
            <div className="pill-text">
              <div className="pill-title">Life Goals</div>
              <div className="pill-amount">
                Rp
                {fmt(
                  life_goals?.reduce((s, g) => s + (g.current_savings || 0), 0) ??
                  0
                )}
              </div>
            </div>
            <img className="pill-img"src="" alt="" />
          </button>

          <button className="pill" onClick={() => handleNavigate("dplk")} style={{backgroundColor: "#FFE8B0"}}>
            <div className="pill-text">
              <div className="pill-title">Pension Funds</div>
              <div className="pill-amount">
                Rp
                {fmt(
                  pension_funds?.reduce((s, p) => s + (p.balance || 0), 0) ?? 0
                )}
              </div>
            </div>  
            <img className="pill-img"src="" alt="" />
          </button>
        </section>

        {/* Bottom section: My Cards & Earnings Overview */}
        <section className="bottom-grid">
          <div className="card cards-panel">
            <div className="cards-header">
              <h3>My Cards</h3>
              <div className="cards-sub">
                Tap a card to see history and manage split bill
              </div>
            </div>

            <div className="slider-wrapper">
              <button className="slider-btn left" onClick={scrollLeft}>
                &lt;
              </button>
              <div className="card-slider" ref={sliderRef}>
                {(cards?.list || []).length > 0 ? (
                  // console.log('xx', cards)

                  (cards.list || []).map((card, idx) => (
                    <Link
                      key={card.account_id ?? idx}
                      to="/detailmycard"
                      className="bank-card"
                    >
                      <div className="card-top">
                        {card.type ?? "ACCOUNT"} - {card.account_number ?? ""}
                      </div>
                      <div className="card-body">
                        <p className="masked">
                          **** **** ****{" "}
                          {String(card.account_number ?? "").slice(-4)}
                        </p>
                        <p className="holder">
                          {card.account_holder_name ?? ""}
                        </p>
                        <h4>
                          Rp{fmt(card.effective_balance ?? card.balance ?? 0)}
                        </h4>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bank-card empty-card">No active cards</div>
                )}
              </div>
              <button className="slider-btn right" onClick={scrollRight}>
                &gt;
              </button>
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
