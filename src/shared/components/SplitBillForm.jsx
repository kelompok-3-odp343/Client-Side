import React, { useState, useEffect, useRef } from "react";
import "../styles/components/split-bill-form.css";
import SplitBillFormCancel from "./SplitBillFormCancel";
import { Plus, Minus } from "lucide-react";
import { createSplitBill } from "../../features/split-bill/api/split-bill.api";
import { useNavigate } from "react-router-dom";

export default function SplitBillForm({ onClose, onSuccess, transaction }) {
  const [participants, setParticipants] = useState([
    { id: Date.now(), participantName: "", participantAmount: "" },
  ]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const inputRefs = useRef({});
  const lastAddedId = useRef(null);
  const navigate = useNavigate();

  const totalBill = parseInt(
    (transaction?.amount || "").toString().replace(/[^\d]/g, ""),
    10
  ) || 0;

  const totalParticipantAmount = participants.reduce(
    (sum, p) => sum + parseInt(p.participantAmount || "0", 10),
    0
  );

  const remainingAmount = totalBill - totalParticipantAmount;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const last = participants[participants.length - 1];
    if (lastAddedId.current && last && lastAddedId.current === last.id) {
      const el = inputRefs.current[last.id];
      if (el && typeof el.focus === "function") el.focus();
      lastAddedId.current = null;
    }
  }, [participants]);

  function handleAddRow() {
    if (totalParticipantAmount === totalBill) return;

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
          `Unsplit amount exceeds the total bill (${formatRp(totalBill.toString())}).`
        );
        return prev;
      }

      setErrorMessage("");
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const emptyName = participants.find(
      (p) => !p.participantName.trim() || !p.participantAmount.trim()
    );

    if (emptyName) {
      setErrorMessage("Please fill in name and amount fields before saving.");
      return;
    }

    if (totalParticipantAmount !== totalBill) {
      setErrorMessage("Split amount doesn't match the total bill.");
      return;
    }

    setIsSaving(true);

    const payload = {
      accountNumber: transaction.accountNumber,
      transactionId: transaction.transactionId,
      splitBillTitle: transaction.detail,
      totalAmount: totalBill,
      billMembers: participants.map((p) => ({
        memberName: p.participantName,
        amountShare: Number(p.participantAmount),
      })),
    };

    try {
      await createSplitBill(payload);
      setShowSuccess(true);
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      const msg = err?.message || "Unknown error";
      if (msg.includes("Server sedang maintance")) {
        setErrorMessage("Server sedang maintance, silahkan coba beberapa saat lagi");
      } else {
        setErrorMessage("Failed saving data, please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const formatRp = (val) => {
    if (!val) return "Rp 0";
    return "Rp " + val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatAmount = (val) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const hasEmptyFields = participants.some(
    (p) => !p.participantName.trim() || !p.participantAmount.trim()
  );

  // disable Add button when either there are empty fields OR the amounts already match
  const disableAddButton = hasEmptyFields || totalParticipantAmount === totalBill;

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
          <div className="bill-info" style={{ ["--theme-color"]: "#6dddd0" }}>
            <p><strong>Bill Name :</strong> {transaction.detail}</p>
            <p><strong>Total Bill :</strong> {transaction.amount}</p>
            <p><strong>Split Amount :</strong> {formatRp(totalParticipantAmount.toString())}</p>
            {remainingAmount > 0 && (
              <p style={{ color: "#c00f0c", fontWeight: "600" }}>
                Unsplit Amount : {formatRp(remainingAmount.toString())}
              </p>
            )}
            {remainingAmount === 0 && (
              <p style={{ color: "#00a05a", fontWeight: "600" }}>
                All amounts match the total bill.
              </p>
            )}
          </div>
        </div>

        <div className="participant-section-container">
          <div className="participant-section">
            <div className="participant-header">
              <span>No</span>
              <span>Bill Member</span>
              <span>Amount Per Member</span>
              <span></span>
            </div>

            {participants.map((p, i) => (
              <div key={p.id} className="participant-row">
                <span className="member-index">{i + 1}</span>
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
                    value={formatAmount(p.participantAmount)}
                    onChange={(e) => handleChangeAmount(p.id, e.target.value)}
                  />
                </div>
                <div className="row-actions">
                  {participants.length > 1 && (
                    <button
                      type="button"
                      className="rmv-btn"
                      onClick={() => handleDeleteRow(p.id)}
                    >
                      <Minus />
                    </button>
                  )}
                  {i === participants.length - 1 && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleAddRow}
                      disabled={disableAddButton}
                      style={{
                        opacity: disableAddButton ? 0.4 : 1,
                        cursor: disableAddButton ? "not-allowed" : "pointer",
                      }}
                      title={
                        disableAddButton
                          ? totalParticipantAmount === totalBill
                            ? "Total split already equals total bill"
                            : "Please fill all fields before adding"
                          : "Add participant"
                      }
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
            disabled={isSaving}
            style={{
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save"}
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
            <h3>Split bill saved successfully!</h3>
            <p>Split bill data has been added to split bill list.</p>
            <div className="success-btn-group">
              <button className="go-splitbill" onClick={() => navigate("/splitbill")}>
                View Split Bill List
              </button>
              <button className="close-success" onClick={() => onClose()}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}