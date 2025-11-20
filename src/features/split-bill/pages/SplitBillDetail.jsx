import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, Download } from "lucide-react";
import Navbar from "../../../shared/components/Navbar";
import generateSplitBillPDF from "../modules/generateSplitBillPDF";
import Swal from "sweetalert2";
import "../styles/split-bill-detail.css";

import {
  getSplitBillById,
  updateSplitBillStatus,
  editSplitBill,
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
          title: "Invalid Data",
          text: "Split Bill ID not found.",
          confirmButtonText: "Back",
          confirmButtonColor: "#6dddd0",
        });
        navigate("/splitbill");
        return;
      }

      const data = await getSplitBillById(state.splitBillId);
      if (!data || !data.members?.length) {
        await Swal.fire({
          icon: "warning",
          title: "Split Bill Detail Not Found",
          text: "Detail not found.",
          confirmButtonText: "Back",
          confirmButtonColor: "#6dddd0",
        });
        navigate("/splitbill");
        return;
      }

      setMembers(data.members.map((m) => ({ ...m, isNew: false })));
      setBill(data);
      setColor(state?.color || "#6dddd0");
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
          <p>{error || "Data not found."}</p>
          <button onClick={() => navigate("/splitbill")}>Back</button>
        </div>
      </div>
    );

  const totalPaid = members
    .filter((m) => m.status === "Paid" || m.hasPaid)
    .reduce((s, m) => s + Number(m.amount || 0), 0);

  const totalUnpaid = Math.max(0, bill.total_bill - totalPaid);
  const progressPercent = (totalPaid / bill.total_bill) * 100;

  const isAddParticipantDisabled =
    members.reduce((s, m) => s + Number(m.amount || 0), 0) === bill.total_bill;

  const handleChangeName = (i, v) => {
    setMembers((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, member_name: v } : m))
    );
  };

  const handleChangeAmount = (i, v) => {
    const sanitized = v.replace(/[^\d]/g, "");
    setMembers((prev) =>
      prev.map((m, idx) =>
        idx === i ? { ...m, amount: Number(sanitized) || 0 } : m
      )
    );
  };

  const handleAddMember = () => {
    if (isAddParticipantDisabled) return;

    setMembers((prev) => [
      ...prev,
      {
        member_id: null,
        member_name: "",
        amount: 0,
        status: "Unpaid",
        hasPaid: false,
        isNew: true,
      },
    ]);
  };

  const handleRemoveMember = (i) => {
    if (members.length === 1) return;
    setMembers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleToggleStatus = async (index) => {
    const target = members[index];

    if (isEditing) {
      if (target.isNew) {
        Swal.fire({
          icon: "warning",
          title: "Cannot change status",
          text: "New row can only be marked as paid after being saved.",
          confirmButtonColor: color,
        });
        return;
      }

      setMembers((prev) =>
        prev.map((m, i) =>
          i === index ? { ...m, status: "Paid", hasPaid: true } : m
        )
      );
      return;
    }

    const updatedMembers = members.map((m, i) =>
      i === index ? { ...m, status: "Paid", hasPaid: true } : m
    );

    setMembers(updatedMembers);

    try {
      const updatedBill = await updateSplitBillStatus(
        bill.split_bill_id,
        updatedMembers
      );
      setBill(updatedBill);
      setMembers(updatedBill.members.map((m) => ({ ...m, isNew: false })));
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Cannot update status.",
      });
    }
  };

  const handleCancelEdit = () => {
    setMembers(bill.members.map((m) => ({ ...m, isNew: false })));
    setIsEditing(false);
    setError("");
  };

  const handleSaveEdit = async () => {
    const emptyName = members.some(
      (m) => !String(m.member_name).trim()
    );
    if (emptyName) return setError("Member name cannot be empty.");

    const sum = members.reduce((s, m) => s + Number(m.amount || 0), 0);
    if (sum !== bill.total_bill)
      return setError("Total amount must match the bill total.");

    try {
      const updatedBill = await editSplitBill(
        bill.split_bill_id,
        bill,
        members
      );

      setBill(updatedBill);
      setMembers(updatedBill.members.map((m) => ({ ...m, isNew: false })));
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Saved successfully",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      setError("Failed saving changes.");
    }
  };

  const handleDownloadPDF = () => {
    const preview = window.open("", "_blank");
    const doc = generateSplitBillPDF(bill, members, color);
    const blob = doc.output("blob");
    preview.location.href = URL.createObjectURL(blob);
  };

  return (
    <div className="sb-detail-container" style={{ "--theme": color }}>
      <Navbar />

      <main className="sb-detail-main">
        <div className="sb-top-row">
          <button className="back-btn" onClick={() => navigate("/splitbill")}>
            <ChevronLeft size={24} className="back-icon" />
            Back to Split Bill
          </button>

          <div className="title-wrap">
            <h1 className="bill-title">{bill.split_bill_title}</h1>
            <p className="bill-meta">
              Ref ID: {bill.ref_id} <br />
              Created:{" "}
              {(() => {
                const d = new Date(bill.created_time);
                const day = d.getDate();
                const month = d.toLocaleString("en-US", { month: "long" });
                const year = d.getFullYear();
                const time = d.toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
                return `${day} ${month} ${year}, ${time}`;
              })()}
            </p>
          </div>

          <div className="action-buttons-right">
            {isEditing ? (
              <>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="save-btn-sb" onClick={handleSaveEdit}>
                  Save
                </button>
              </>
            ) : (
              <>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <Edit size={24} className="edit-icon" />
                  Edit
                </button>
                <button className="pdf-btn" onClick={handleDownloadPDF}>
                  <Download size={24} className="pdf-icon" />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>

        <section className="bill-summary">
          <div className="summary-row">
            <div className="summary-label total-label">Bill Total</div>
            <div className="summary-value total-value">
              Rp{Number(bill.total_bill).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="summary-progress-row">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%`, background: color }}
              />
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-label paid-label">Paid Amount</div>
            <div className="summary-value paid-value">
              Rp{Number(totalPaid).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-label unpaid-label">Unpaid Amount</div>
            <div className="summary-value unpaid-value">
              Rp{Number(totalUnpaid).toLocaleString("id-ID")}
            </div>
          </div>
        </section>

        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Bill Member</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  {!isEditing && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {members.map((m, i) => {
                  const isPaid = m.status === "Paid";

                  return (
                    <tr key={m.member_id ?? i}>
                      <td>{i + 1}</td>

                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={m.member_name}
                            onChange={(e) =>
                              handleChangeName(i, e.target.value)
                            }
                            disabled={isPaid}
                            className={isPaid ? "disabled-input" : ""}
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
                              value={Number(m.amount).toLocaleString("id-ID")}
                              onChange={(e) =>
                                handleChangeAmount(i, e.target.value)
                              }
                              disabled={isPaid}
                              className={isPaid ? "disabled-input" : ""}
                            />
                          ) : (
                            <span>
                              {Number(m.amount).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="status-edit-combo">
                          <span
                            className={`status-text ${m.status.toLowerCase()}`}
                          >
                            {m.status}
                          </span>

                          {isEditing && m.isNew && (
                            <button
                              className="remove-member-small"
                              onClick={() => handleRemoveMember(i)}
                            >
                              −
                            </button>
                          )}
                        </div>
                      </td>

                      {!isEditing && (
                        <td>
                          <div className="action-wrapper">
                            {isPaid ? (
                              <span className="status-placeholder">—</span>
                            ) : (
                              <button
                                className="mark-btn"
                                onClick={() => handleToggleStatus(i)}
                              >
                                Mark as Paid
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isEditing && (
            <div className="edit-actions-row">
              <button
                className="add-member"
                disabled={isAddParticipantDisabled}
                onClick={handleAddMember}
              >
                + Add Participant
              </button>

              <div className="right-actions">
                Total:{" "}
                <strong>
                  Rp
                  {members
                    .reduce((s, m) => s + Number(m.amount), 0)
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