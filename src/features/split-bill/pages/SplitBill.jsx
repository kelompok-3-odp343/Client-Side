import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import "../styles/split-bill.css";
import { fetchSplitBills } from "../api/split-bill.api"; 

export default function SplitBill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#6dddd0");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSplitBills(); // 
      setBills(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleViewDetail = (bill, color) => {
    setSelectedBill(bill);
    setSelectedColor(color);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBill(null);
  };

  const handleTogglePaid = (index) => {
    if (!selectedBill) return;

    const updated = {
      ...selectedBill,
      members: selectedBill.members.map((m, idx) =>
        idx === index
          ? { ...m, status: m.status === "Paid" ? "Unpaid" : "Paid" }
          : m
      ),
    };

    updated.remaining_bill = updated.members
      .filter((m) => m.status !== "Paid")
      .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    setSelectedBill(updated);
    setBills((prev) =>
      prev.map((b) =>
        b.split_bill_id === updated.split_bill_id ? updated : b
      )
    );
  };

  const cardColors = ["#6dddd0", "#9c7edc", "#ffd367"];

  if (loading) return <div className="loading">Loading split bills...</div>;

  return (
    <div className="sb-container">
      <Navbar />
      <main className="sb-main">
        <h1 className="sb-title">Split Bill</h1>
        <p className="sb-sub">Track and manage your shared expenses</p>

        <div className="sb-grid">
          {bills.map((bill, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const color = cardColors[(row + col) % cardColors.length];
            const membersToShow = bill.members.slice(0, 3);
            const extraCount = Math.max(
              0,
              bill.members.length - membersToShow.length
            );

            return (
              <div
                key={bill.split_bill_id}
                className="sb-card"
                style={{ "--color": color }}
              >
                <div className="sb-card-header">
                  <h3>{bill.split_bill_title}</h3>
                  <p>
                    <span>Total Bill</span>
                    <span className="amount">
                      Rp {bill.total_bill.toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>

                <div className="sb-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (bill.members.filter((m) => m.status === "Paid")
                            .length /
                            Math.max(1, bill.members.length)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="sb-members">
                  {membersToShow.map((m, idx) => (
                    <div key={idx} className="sb-member-row">
                      <span>{m.member_name}</span>
                      <span>
                        Rp{Number(m.amount).toLocaleString("id-ID")}{" "}
                        <span
                          className={`status ${
                            m.status === "Paid" ? "paid" : "unpaid"
                          }`}
                        >
                          {m.status}
                        </span>
                      </span>
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div className="sb-member-more">+{extraCount} more</div>
                  )}
                </div>

                <button
                  className="view-btn"
                  onClick={() => handleViewDetail(bill, color)}
                >
                  View Detail
                </button>
              </div>
            );
          })}
        </div>

        {showModal && selectedBill && (
          <div className="sb-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="sb-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ borderTop: `6px solid ${selectedColor}` }}
            >
              <h2 className="modal-title" style={{ color: selectedColor }}>
                {selectedBill.split_bill_title}
              </h2>
              <p className="modal-meta">
                {new Date(selectedBill.created_time).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}{" "}
                WIB
              </p>
              <p className="modal-ref">Ref ID: {selectedBill.ref_id}</p>

              <div
                className="modal-total"
                style={{
                  background: `linear-gradient(to right, ${selectedColor}, #fff)`,
                }}
              >
                <span>Total Bill</span>
                <span>
                  Rp {selectedBill.total_bill.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="modal-list scrollable">
                <h4>Detail Bill</h4>
                {selectedBill.members.map((m, i) => (
                  <div key={i} className="modal-row">
                    <span>{m.member_name}</span>
                    <span>
                      {m.status === "Paid" ? "+" : "-"} Rp
                      {Number(m.amount).toLocaleString("id-ID")}
                      <br />
                      <button
                        className="mark-btn"
                        style={{
                          borderColor: selectedColor,
                          color:
                            m.status === "Paid" ? "#fff" : selectedColor,
                          backgroundColor:
                            m.status === "Paid"
                              ? selectedColor
                              : "transparent",
                        }}
                        onClick={() => handleTogglePaid(i)}
                      >
                        {m.status === "Paid"
                          ? "Mark as Unpaid"
                          : "Mark as Paid"}
                      </button>
                    </span>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <span>Remaining Bill</span>
                <span>
                  Rp {Number(selectedBill.remaining_bill).toLocaleString("id-ID")}
                </span>
              </div>

              <button
                className="close-btn"
                style={{
                  backgroundColor: selectedColor,
                  color: "#fff",
                  border: "none",
                }}
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}