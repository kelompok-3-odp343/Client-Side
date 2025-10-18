import React, { useState, useEffect, useRef } from "react";
import "../styles/components/split-bill-form.css";
import SplitBillFormCancel from "./SplitBillFormCancel";
import { Plus, Minus } from "lucide-react";
import { createSplitBill } from "../../features/split-bill/api/split-bill.api";
import { useNavigate } from "react-router-dom";

export default function SplitBillForm({ onClose, transaction }) {
  const [participants, setParticipants] = useState([
    { id: Date.now(), participantName: "Evan Edrin", participantAmount: "15000" },
  ]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const inputRefs = useRef({});
  const lastAddedId = useRef(null);
  const navigate = useNavigate();

  const totalBill = parseInt(
    (transaction.amount || "").toString().replace(/[^\d]/g, ""),
    10
  );

  const totalParticipantAmount = participants.reduce(
    (sum, p) => sum + parseInt(p.participantAmount || "0", 10),
    0
  );

  const remainingAmount = totalBill - totalParticipantAmount;

  // 🔒 Kunci scroll background saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🎯 Fokus otomatis pada input baru
  useEffect(() => {
    const last = participants[participants.length - 1];
    if (lastAddedId.current && last && lastAddedId.current === last.id) {
      const el = inputRefs.current[last.id];
      if (el && typeof el.focus === "function") el.focus();
      lastAddedId.current = null;
    }
  }, [participants]);

  function handleAddRow() {
    const newId = Date.now() + Math.random();
    lastAddedId.current = newId;
    setParticipants((prev) => [
      ...prev,
      { id: newId, participantName: "", participantAmount: "" },
    ]);
  }

  function handleDeleteRow(id) {
    setErrorMessage("");
    setParticipants((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((p) => p.id !== id);
    });
  }

  function handleChangeName(id, value) {
    setErrorMessage("");
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, participantName: value } : p))
    );
  }

  function handleChangeAmount(id, value) {
    const sanitized = value.replace(/[^\d]/g, "");
    setParticipants((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, participantAmount: sanitized } : p
      );

      const newTotal = updated.reduce(
        (sum, p) => sum + parseInt(p.participantAmount || "0", 10),
        0
      );

      if (newTotal > totalBill) {
        setErrorMessage(
          `Jumlah total pembagian melebihi nilai tagihan (${formatRp(totalBill.toString())}).`
        );
        return prev;
      }

      setErrorMessage("");
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (totalParticipantAmount !== totalBill) {
      setErrorMessage("Total pembagian harus sama dengan total tagihan sebelum disimpan.");
      return;
    }

    setIsSaving(true);

    const payload = {
      split_bill_title: transaction.detail,
      total_bill: totalBill,
      ref_id: transaction.id,
      members: participants.map((p) => ({
        member_name: p.participantName,
        amount: Number(p.participantAmount),
        status: "Unpaid",
      })),
    };

    try {
      await createSplitBill(payload);
      setShowSuccess(true);
    } catch {
      setErrorMessage("Gagal menyimpan data, coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  const formatRp = (val) => {
    if (!val) return "Rp 0";
    return "Rp " + val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const hasEmptyFields = participants.some(
    (p) => !p.participantName.trim() || !p.participantAmount.trim()
  );

  const disableSave = isSaving || remainingAmount !== 0 || hasEmptyFields;

  return (
    <div className="splitbill-modal" role="dialog" aria-modal="true">
      <div className="splitbill-container">
        <h2 className="title">Split Bill Form</h2>
        <hr />

        <div className="transaction-info">
          <div className="transaction-info-left-panel">
            <p>
              <strong>Transaction ID :</strong> {transaction.id}
            </p>
          </div>
          <div className="transaction-info-right-panel">
            <p>
              <strong>Transaction Date :</strong> {transaction.date}
            </p>
          </div>
        </div>

        <div className="bill-info-container">
          <div className="bill-info">
            <p><strong>Bill Name :</strong> {transaction.detail}</p>
            <p><strong>Total Bill :</strong> {transaction.amount}</p>
            <p style={{ fontWeight: "600", color: "#333" }}>
              Total Dibagi: {formatRp(totalParticipantAmount.toString())}
            </p>
            {remainingAmount > 0 && (
              <p style={{ color: "#c88a00", fontWeight: "600" }}>
                Sisa belum terbagi: {formatRp(remainingAmount.toString())}
              </p>
            )}
            {remainingAmount === 0 && (
              <p style={{ color: "#00a05a", fontWeight: "600" }}>
                Pembagian sudah pas.
              </p>
            )}
          </div>
        </div>

        <div className="participant-secition-container">
          <div className="participant-section">
            <div className="participant-header">
              <span>No</span>
              <span>Bill Members</span>
              <span>Amount Per Member</span>
              <span></span>
            </div>

            {participants.map((p, i) => (
              <div key={p.id} className="participant-row">
                <span>{i + 1}</span>
                <input
                  type="text"
                  placeholder="Enter name"
                  ref={(el) => (inputRefs.current[p.id] = el)}
                  value={p.participantName}
                  onChange={(e) => handleChangeName(p.id, e.target.value)}
                />
                <div className="col-amount">
                  <span className="rp-prefix">Rp</span>
                  <input
                    inputMode="numeric"
                    type="text"
                    placeholder="0"
                    value={p.participantAmount}
                    onChange={(e) => handleChangeAmount(p.id, e.target.value)}
                  />
                </div>
                <div className="row-actions">
                  {participants.length > 1 && (
                    <button type="button" className="rmv-btn" onClick={() => handleDeleteRow(p.id)}>
                      <Minus />
                    </button>
                  )}
                  {i === participants.length - 1 && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleAddRow}
                      disabled={hasEmptyFields}
                      style={{
                        opacity: hasEmptyFields ? 0.4 : 1,
                        cursor: hasEmptyFields ? "not-allowed" : "pointer",
                      }}
                    >
                      <Plus />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="add-participant-btn-container">
          <button
            className="cancel-add-participant"
            onClick={() => setShowCancelPopup(true)}
          >
            Cancel
          </button>
          <button
            className="add-participant-btn"
            onClick={handleSubmit}
            disabled={disableSave}
            style={{
              opacity: disableSave ? 0.6 : 1,
              cursor: disableSave ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Split"}
          </button>
        </div>
      </div>

      {showCancelPopup && (
        <SplitBillFormCancel
          onConfirm={onClose}
          onCancel={() => setShowCancelPopup(false)}
        />
      )}

      {showSuccess && (
        <div className="splitbill-success-overlay">
          <div className="splitbill-success-modal">
            <h3>Split Bill berhasil disimpan!</h3>
            <p>Data tagihan bersama telah ditambahkan ke daftar Split Bill.</p>
            <div className="success-btn-group">
              <button className="go-splitbill" onClick={() => navigate("/splitbill")}>
                Lihat Split Bill
              </button>
              <button className="close-success" onClick={() => onClose()}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}