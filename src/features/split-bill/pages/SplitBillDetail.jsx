import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import "../styles/split-bill-detail.css";
import {
  updateSplitBillStatus,
  getSplitBillById,
} from "../api/split-bill.api";

export default function SplitBillDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [color, setColor] = useState("#6dddd0");
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

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
          setColor(state.color || "#6dddd0");
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

  const handleToggleStatus = async (index) => {
    setMembers((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m;
        if (m.status === "Paid") {
          return isEditing ? { ...m, status: "Unpaid" } : m;
        } else {
          return { ...m, status: "Paid" };
        }
      })
    );

    // Jika bukan edit mode, langsung update storage agar progress tersimpan
    if (!isEditing) {
      const updated = members.map((m, i) => {
        if (i !== index) return m;
        if (m.status === "Paid") return m; 
        return { ...m, status: "Paid" };
      });
      await updateSplitBillStatus(bill.split_bill_id, updated);
      setBill((prev) => ({ ...prev, members: updated }));
    }
  };

  const handleAddMember = () => {
    setMembers((prev) => [
      ...prev,
      { member_name: "", amount: 0, status: "Unpaid" },
    ]);
  };

  const handleRemoveMember = (index) => {
    if (members.length === 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeName = (index, value) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, member_name: value } : m))
    );
  };

  const handleChangeAmount = (index, value) => {
    const sanitized = value.replace(/[^\d]/g, "");
    setMembers((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, amount: Number(sanitized) || 0 } : m
      )
    );
  };

  const handleCancelEdit = () => {
    setMembers(bill.members);
    setIsEditing(false);
    setError("");
  };

  const handleSaveEdit = async () => {
    try {
      await updateSplitBillStatus(bill.split_bill_id, members);
      setBill((prev) => ({ ...prev, members }));
      setIsEditing(false);
    } catch {
      setError("Failed to save changes.");
    }
  };

  // === Render ===
  return (
    <div className="sb-detail-container" style={{ "--theme": color }}>
      <Navbar />
      <main
        className={`sb-detail-main ${isEditing ? "edit-mode" : ""}`}
        style={{ "--theme": color }}
      >
        {/* HEADER BAR */}
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

          <div className="action-buttons-right">
            {isEditing ? (
              <>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="edit-btn" onClick={handleSaveEdit}>
                  Save
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* BILL SUMMARY */}
        <section className="bill-summary">
          <div className="summary-left">
            <div className="label">Bill Total</div>
            <div className="total">
              Rp{bill.total_bill.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="summary-right">
            <div className="label-inline">
              <div className="label-small">Paid Amount</div>
              <div className="value paid">
                Rp{totalPaid.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="label-inline">
              <div className="label-small">Unpaid Amount</div>
              <div className="value unpaid">
                Rp{totalUnpaid.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS BAR */}
        <div className="progress-section">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%`, background: color }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>No</th>
                  <th style={{ width: "32%" }}>Bill Member</th>
                  <th style={{ width: "25%" }}>Amount</th>
                  <th style={{ width: "20%" }}>Payment Status</th>
                  <th style={{ width: "17%" }}>Status Update</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={m.member_name}
                          placeholder="Enter name"
                          onChange={(e) =>
                            handleChangeName(i, e.target.value)
                          }
                        />
                      ) : (
                        m.member_name
                      )}
                    </td>
                    <td>
                      <div className="amount-input-wrap">
                        <span className="rp-prefix">Rp</span>
                        {isEditing ? (
                          <input
                            type="text"
                            inputMode="numeric"
                            value={m.amount.toLocaleString("id-ID")}
                            onChange={(e) =>
                              handleChangeAmount(i, e.target.value)
                            }
                          />
                        ) : (
                          <span>{Number(m.amount).toLocaleString("id-ID")}</span>
                        )}
                      </div>
                    </td>
                    <td
                      className={`status ${m.status.toLowerCase()}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {m.status}
                    </td>
                    <td className="action-cell">
                      <div className="action-flex">
                        <button
                          className="mark-btn"
                          onClick={() => handleToggleStatus(i)}
                          disabled={
                            m.status === "Paid" && !isEditing // only disable Mark as Unpaid outside edit
                          }
                          style={
                            m.status === "Paid"
                              ? {
                                  border: `1.5px solid ${color}`,
                                  color,
                                  background: "transparent",
                                }
                              : { background: color, color: "#fff" }
                          }
                        >
                          {m.status === "Paid"
                            ? "Mark as Unpaid"
                            : "Mark as Paid"}
                        </button>
                        {isEditing && (
                          <button
                            className="remove-member-small"
                            onClick={() => handleRemoveMember(i)}
                          >
                            −
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEditing && (
            <div className="edit-actions-row">
              <button
                className="add-member"
                onClick={handleAddMember}
                style={{ borderColor: color, color }}
              >
                + Add Participant
              </button>
              <div className="right-actions">
                Total per participants:{" "}
                <strong>
                  Rp
                  {members
                    .reduce((s, m) => s + Number(m.amount || 0), 0)
                    .toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          )}
        </div>

        {error && <div className="global-error">{error}</div>}
      </main>
    </div>
  );
}