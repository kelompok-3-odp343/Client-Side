import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../css/globals.css";

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
          const response = await fetch(`${API_BASE_URL}/api/dashboard?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("API error");
          const result = await response.json();
          setData(result);
        } else {
          // Simulasi data dummy
          setData({
            name: "User Simulasi",
            assets: 17580062,
            income: 17580062,
            expenses: 10580062,
            splitProgress: 75,
            cards: [
              { name: "Taplus Bisnis", balance: 50000000 },
              { name: "Taplus Muda", balance: 20000000 },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          name: "Offline Mode",
          assets: 10000000,
          income: 8000000,
          expenses: 3000000,
          splitProgress: 60,
          cards: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No data found</p>;

  const { assets, income, expenses, splitProgress, cards } = data;

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  // ✅ Fungsi navigasi langsung ke halaman fitur
  const handleNavigate = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Header */}
      <main style={{ paddingTop: "90px", textAlign: "center" }}>
        <h2>Welcome to your Dashboard</h2>
      </main>

      {/* Top Section */}
      <div className="top-section">
        <div className="card asset-card">
          <h3><b>Assets Total</b></h3>
          <h2>Rp{assets.toLocaleString("id-ID")}</h2>
          <p>You made extra Rp20.000 this month</p>
        </div>

        <div className="card income-expense-card">
          <h4><b>Income & Expenses</b></h4>
          <div className="info-row">
            <p className="income">
              <i className="bi bi-pie-chart"></i> + Rp{income.toLocaleString("id-ID")}
            </p>
            <span>Total income this month</span>
          </div>
          <div className="info-row">
            <p className="expense">
              <i className="bi bi-pie-chart"></i> - Rp{expenses.toLocaleString("id-ID")}
            </p>
            <span>Total expenses this month</span>
          </div>
        </div>

        <div className="card split-card">
          <h4><b>Split Bill</b></h4>
          <div
            className="circle"
            style={{
              background: `conic-gradient(#2cb1ff ${splitProgress * 3.6}deg, #ddd 0deg)`,
            }}
          >
            <div className="percent">{splitProgress}%</div>
          </div>
          <div className="description">
            There are 4 ongoing split bills<br />
            Remaining bill: Rp2.000.000<br />
            Potential asset: Rp32.580.062
          </div>
          <a href="#" className="detail-link">View Detail</a>
        </div>
      </div>

      {/* Middle Section — Navigasi ke Halaman Fitur */}
      <div className="category-section">
        <div className="category yellow" onClick={() => handleNavigate("deposit")}>
          Deposits
          <br />Rp 15.000.000
        </div>

        <div className="category purple" onClick={() => handleNavigate("mycard")}>
          My Card
          <br />Rp 25.000.000
        </div>

        <div className="category green" onClick={() => handleNavigate("lifegoals")}>
          Life Goals
          <br />Rp 35.000.000
        </div>

        <div className="category orange" onClick={() => handleNavigate("dplk")}>
          DPLK
          <br />Rp 12.000.000
        </div>

        <div className="category blue" onClick={() => handleNavigate("splitbill")}>
          Split Bill
          <br />Rp 10.000.000
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="mycards">
          <h3>My Cards</h3>
          <div className="slider-wrapper">
            <button className="slider-btn left" onClick={scrollLeft}>&lt;</button>
            <div className="card-slider" ref={sliderRef}>
              {cards.map((card, idx) => (
                <Link to="/mycard" key={idx} className="bank-card">
                  <h5>{card.name.toUpperCase()}</h5>
                  <p>12345678910</p>
                  <p>Effective balance</p>
                  <h4>Rp{card.balance.toLocaleString("id-ID")}</h4>
                </Link>
              ))}
            </div>
            <button className="slider-btn right" onClick={scrollRight}>&gt;</button>
          </div>
        </div>

        <div className="earnings">
          <h3>Earnings Overview</h3>
          <div className="bar-container">
            <div className="bar income-bar">
              <span>Income</span>
              <div
                className="bar-value"
                style={{
                  "--bar-height": `${Math.min((income / (income + expenses)) * 100, 100)}%`,
                }}
              ></div>
              <p>Rp{income.toLocaleString("id-ID")}</p>
            </div>
            <div className="bar expense-bar">
              <span>Expenses</span>
              <div
                className="bar-value"
                style={{
                  "--bar-height": `${Math.min((expenses / (income + expenses)) * 100, 100)}%`,
                }}
              ></div>
              <p>Rp{expenses.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}