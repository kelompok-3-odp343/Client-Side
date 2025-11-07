import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import Swal from "sweetalert2";
import "../styles/split-bill-detail.css";
import {
  getSplitBillById,
  updateSplitBillStatus,
} from "../api/split-bill.api";

export default function SplitBillDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [members, setMembers] = useState([]);
  const [color, setColor] = useState(state?.color || "#6dddd0");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (!state?.splitBillId) {
        await Swal.fire({
          icon: "info",
          title: "Data tidak valid",
          text: "Split Bill ID tidak ditemukan.",
          confirmButtonText: "Kembali",
          confirmButtonColor: "#6dddd0",
        });
        navigate("/splitbill");
        return;
      }

      const data = await getSplitBillById(state.splitBillId);

      if (!data || !data.members || data.members.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "Tidak memiliki Split Bill Detail",
          text: "Data detail tidak ditemukan atau sudah dihapus.",
          confirmButtonText: "Kembali",
          confirmButtonColor: "#6dddd0",
        });
        navigate("/splitbill");
        return;
      }

      setBill(data);
      setMembers(data.members);
      setColor("#6dddd0");
      setLoading(false);
    }

    fetchDetail();
  }, [state, navigate]);

  if (loading)
    return (
      <div className="sb-detail-container">
        <Navbar />
        <div className="sb-detail-error">Loading...</div>
      </div>
    );

  if (!bill)
    return (
      <div className="sb-detail-container">
        <Navbar />
        <div className="sb-detail-error">
          <p>{error || "Data tidak ditemukan."}</p>
          <button onClick={() => navigate("/splitbill")}>Kembali</button>
        </div>
      </div>
    );


  const totalPaid = members
    .filter((m) => m.status === "Paid")
    .reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const totalUnpaid = Math.max(0, (bill.total_bill || 0) - totalPaid);
  const progressPercent =
    (totalPaid / Math.max(1, bill.total_bill || 1)) * 100;

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

    if (!isEditing) {
      const updated = members.map((m, i) =>
        i === index
          ? { ...m, status: m.status === "Paid" ? "Unpaid" : "Paid" }
          : m
      );
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
      Swal.fire({
        icon: "success",
        title: "Berhasil disimpan",
        text: "Perubahan data telah disimpan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      setError("Gagal menyimpan perubahan.");
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: "Terjadi kesalahan saat menyimpan perubahan.",
      });
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
              Ref ID: <span>{bill.ref_id}</span>
              <br />
              Created:{" "}
              {new Date(bill.created_time).toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
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
              Rp{Number(bill.total_bill || 0).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="summary-right">
            <div className="label-inline">
              <div className="label-small">Paid Amount</div>
              <div className="value paid">
                Rp{Number(totalPaid || 0).toLocaleString("id-ID")}
              </div>
            </div>
            <div className="label-inline">
              <div className="label-small">Unpaid Amount</div>
              <div className="value unpaid">
                Rp{Number(totalUnpaid || 0).toLocaleString("id-ID")}
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
                          onChange={(e) => handleChangeName(i, e.target.value)}
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
                            value={Number(m.amount || 0).toLocaleString("id-ID")}
                            onChange={(e) =>
                              handleChangeAmount(i, e.target.value)
                            }
                          />
                        ) : (
                          <span>
                            {Number(m.amount || 0).toLocaleString("id-ID")}
                          </span>
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
                          disabled={m.status === "Paid" && !isEditing}
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