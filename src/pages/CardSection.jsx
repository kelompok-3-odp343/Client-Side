import React, { useState, useEffect } from "react";
import "../css/cardstyle.css";
import { EyeOff, Eye, Settings, Bell, User, Filter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DUMMY_CARDS } from "../data/dummy";
import Navbar from "../components/Navbar";
/**
 * CardSection: expects location.state.card (object) OR falls back to first dummy card
 */
export default function MyCards() {
  const location = useLocation();
  const navigate = useNavigate();

  // location.state might be { card, allCards }
  const incoming = location.state || {};
  const incomingCard = incoming.card || null;
  const allCardsFromState = incoming.allCards || DUMMY_CARDS;

  // fallback: if no incoming card, choose first card (or null)
  const [card, setCard] = useState(incomingCard ?? allCardsFromState[0] ?? null);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // if user navigates to this route directly with ?accountId param (optional),
  // you could also detect it and pick card by id (not required for state method).

  useEffect(() => {
    // If location changes and provides a card, update
    if (incomingCard) setCard(incomingCard);
  }, [incomingCard]);

  const toggleCardNumber = () => setShowCardNumber(!showCardNumber);

  if (!card) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="logo">Wandoor</h1>
        </header>
        <main className="dashboard-main">
          <div className="card">
            <h3>No card selected</h3>
            <p>Please go back to the dashboard and select a card.</p>
            <button onClick={() => navigate(-1)}>Back</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        {/* Header area or back button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2>{card.type} - {card.account_number}</h2>
            <p className="subtext">Account details</p>
          </div>
          <div>
            <button onClick={() => navigate(-1)} style={{ padding: "8px 12px", borderRadius: 8 }}>Back</button>
          </div>
        </div>

        {/* Card detail */}
        <section className="left-section">
          <div className="card-container">
            <div className="card-gradient">
              <p className="bank-name">{card.type}</p>
              <p className="card-number">
                {showCardNumber ? (card.account_number) : (card.masked ?? `**** **** **** ${String(card.account_number).slice(-4)}`)}
                <span onClick={toggleCardNumber} className="eye-icon" style={{ marginLeft: 8 }}>
                  {showCardNumber ? <Eye /> : <EyeOff />}
                </span>
              </p>
              <p className="cardholder">{card.account_holder_name}</p>
              <p className="account-type">Account ID: {card.account_id}</p>
              <p style={{ marginTop: 18, fontSize: 20, fontWeight: 800 }}>Rp{(card.effective_balance ?? 0).toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* other boxes (warning/earnings) - you can keep original markup */}
          <div className="warning-box">
            ⚠️ Jangan bagikan nomor kartu, tanggal kadaluarsa, dan kode CVV/CVC ke siapa pun.
          </div>

        </section>

        {/* Right Section - transaction history or details */}
        <section className="right-section">
          <div className="transaction-header">
            <h2>Transaction History</h2>
          </div>

          {/* here you can render transactions filtered by card.account_number */}
          <div className="transaction-list">
            <div className="date">31 May 2025</div>
            <div className="transaction-item">
              <span>QRIS</span>
              <p>Warung Kak Ros</p>
              <div className="amount negative">-Rp25.000</div>
              <span className="split">Split bill</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
