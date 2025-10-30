import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import "../styles/split-bill-detail.css";
import { updateSplitBillStatus, getSplitBillById } from "../api/split-bill.api";

// Placeholder modal (nanti diganti dengan SplitBillFormEdit.jsx)
function SplitBillFormEdit({ bill, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Split Bill</h2>
        <p>
          Form edit untuk <strong>{bill.split_bill_title}</strong> akan
          ditampilkan di sini.
        </p>
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function SplitBillDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [color, setColor] = useState("#6dddd0");
  const [members, setMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (state && state.bill) {
        setBill(state.bill);
        setColor(state.color || "#6dddd0");
        setMembers(state.bill.members);
      } else if (state?.billId) {
        const data = await getSplitBillById(state.billId);
        if (data) {
          setBill(data);
          setMembers(data.members);
        }
      }
    }
    loadData();
  }, [state]);

  if (!bill) {
    return (
      <div className="sb-detail-container">
        <Navbar />
        <div className="sb-detail-error">
          <p>Loading...</p>
          <button onClick={() => navigate("/splitbill")}>Back</button>
        </div>
      </div>
    );
  }

  const totalPaid = members
    .filter((m) => m.status === "Paid")
    .reduce((s, m) => s + Number(m.amount || 0), 0);
  const totalUnpaid = Math.max(0, bill.total_bill - totalPaid);
  const progressPercent = (totalPaid / Math.max(1, bill.total_bill)) * 100;

  const handleMarkAsPaid = async (index) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, status: "Paid" } : m
    );
    setMembers(updated);
    await updateSplitBillStatus(bill.split_bill_id, updated);
  };

  return (
    <div className="sb-detail-container" style={{ "--theme": color }}>
      <Navbar />
      <main className="sb-detail-main">
        <div className="sb-top-row">
          <button className="back-btn" onClick={() => navigate("/splitbill")}>
            ← Back to Split Bill
          </button>

          <div className="title-wrap">
            <h1 className="bill-title">{bill.split_bill_title}</h1>
            <p className="bill-meta">
              Trx Date:{" "}
              {new Date(bill.created_time).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              <br />
              Ref ID: <span>{bill.ref_id}</span>
            </p>
          </div>

          <button className="edit-btn" onClick={() => setShowEditModal(true)}>
            Edit
          </button>
        </div>

        <section className="bill-summary">
          <div className="summary-left">
            <div className="label">Bill Total</div>
            <div className="total">Rp{bill.total_bill.toLocaleString("id-ID")}</div>
          </div>

          <div className="summary-right">
            <div className="label-inline">
              <div className="label-small">Paid Amount</div>
              <div className="value paid">Rp{totalPaid.toLocaleString("id-ID")}</div>
            </div>
            <div className="label-inline">
              <div className="label-small">Unpaid Amount</div>
              <div className="value unpaid">Rp{totalUnpaid.toLocaleString("id-ID")}</div>
            </div>
          </div>
        </section>

        <div className="progress-section">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%`, background: color }}
            />
          </div>
        </div>

        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Bill Member</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Status Update</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{m.member_name}</td>
                    <td>Rp{Number(m.amount).toLocaleString("id-ID")}</td>
                    <td className={`status ${m.status.toLowerCase()}`}>{m.status}</td>
                    <td>
                      <button
                        className="mark-btn"
                        style={
                          m.status === "Paid"
                            ? {
                                border: `1.5px solid ${color}`,
                                color,
                                background: "transparent",
                              }
                            : { background: color, color: "#fff", border: "none" }
                        }
                        onClick={() => handleMarkAsPaid(i)}
                        disabled={m.status === "Paid"}
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal edit */}
        {showEditModal && (
          <SplitBillFormEdit bill={bill} onClose={() => setShowEditModal(false)} />
        )}
      </main>
    </div>
  );
}