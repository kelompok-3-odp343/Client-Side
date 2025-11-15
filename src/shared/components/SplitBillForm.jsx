import React, { useState, useEffect, useRef } from "react";
import "../styles/components/split-bill-form.css";
import SplitBillFormCancel from "./SplitBillFormCancel";
import { Plus, Minus } from "lucide-react";
import { createSplitBill } from "../../features/split-bill/api/split-bill.api";

export default function SplitBillForm({ onClose, onSuccess, transaction }) {
  const [participants, setParticipants] = useState([
    { id: Date.now(), participantName: "", participantAmount: "" },
  ]);

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [localSuccessId, setLocalSuccessId] = useState(null);

  const inputRefs = useRef({});
  const lastAddedId = useRef(null);

  const totalBill =
    parseInt(String(transaction?.amount || "").replace(/[^\d]/g, ""), 10) || 0;

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

  const handleAddRow = () => {
    if (totalParticipantAmount === totalBill) return;
    const newId = Date.now() + Math.random();
    lastAddedId.current = newId;
    setParticipants((prev) => [
      ...prev,
      { id: newId, participantName: "", participantAmount: "" },
    ]);
  };

  const handleDeleteRow = (id) => {
    setErrorMessage("");
    setParticipants((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleChangeName = (id, value) => {
    setErrorMessage("");
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, participantName: value } : p
      )
    );
  };

  const handleChangeAmount = (id, value) => {
    const sanitized = value.replace(/[^\d]/g, "");
    setParticipants((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, participantAmount: sanitized }
          : p
      );

      const newTotal = updated.reduce(
        (sum, p) => sum + parseInt(p.participantAmount || "0", 10),
        0
      );

      if (newTotal > totalBill) {
        setErrorMessage(
          `Unsplit amount exceeds the total bill (Rp ${totalBill.toLocaleString("id-ID")}).`
        );
        return prev;
      }

      setErrorMessage("");
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const emptyField = participants.find(
      (p) => !p.participantName.trim() || !p.participantAmount.trim()
    );
    if (emptyField) {
      setErrorMessage("Please fill in name and amount fields.");
      return;
    }

    if (totalParticipantAmount !== totalBill) {
      setErrorMessage("Split amount doesn't match total bill.");
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
      const resp = await createSplitBill(payload);

      let newSplitBillId =
        resp?.split_bill_id ||
        resp?.id ||
        resp?.data?.id ||
        `sb_${Date.now()}`;

      setLocalSuccessId(newSplitBillId);
    } catch (err) {
      setErrorMessage(
        err?.message?.includes("maintance")
          ? "Server sedang maintenance, coba lagi."
          : "Failed saving data."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatAmount = (val) =>
    !val ? "" : val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const formatRp = (val) =>
    !val ? "Rp 0" : "Rp " + val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const hasEmpty = participants.some(
    (p) => !p.participantName.trim() || !p.participantAmount.trim()
  );

  const disableAdd = hasEmpty || totalParticipantAmount === totalBill;

  return (
    <div className="splitbill-modal" role="dialog" aria-modal="true">
      <div className="splitbill-container">
        <h2 className="title">Split Bill Form</h2>
        <hr />

        <div className="transaction-info">
          <p><strong>Transaction ID: </strong>{transaction.transactionId}</p>
          <p><strong>Date: </strong>{transaction.transactionDate}</p>
        </div>

        <div className="bill-info-container">
          <div className="bill-info" style={{ ["--theme-color"]: "#6dddd0" }}>
            <p><strong>Bill Name :</strong> {transaction.detail}</p>
            <p><strong>Total Bill :</strong> {transaction.amount}</p>
            <p><strong>Split Amount :</strong> {formatRp(totalParticipantAmount.toString())}</p>
            {remainingAmount > 0 && (
              <p style={{ color: "#c00f0c", fontWeight: 600 }}>
                Unsplit Amount: {formatRp(remainingAmount.toString())}
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

                <div className="col-name">
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={p.participantName}
                    onChange={(e) => handleChangeName(p.id, e.target.value)}
                    ref={(el) => (inputRefs.current[p.id] = el)}
                    disabled={isSaving}
                  />
                </div>

                <div className="col-amount">
                  <span className="rp-prefix">Rp</span>
                  <input
                    inputMode="numeric"
                    type="text"
                    placeholder="0"
                    value={formatAmount(p.participantAmount)}
                    onChange={(e) => handleChangeAmount(p.id, e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="row-actions">
                  {participants.length > 1 && (
                    <button
                      type="button"
                      className="rmv-btn"
                      onClick={() => handleDeleteRow(p.id)}
                      disabled={isSaving}
                    >
                      <Minus />
                    </button>
                  )}

                  {i === participants.length - 1 && (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleAddRow}
                      disabled={disableAdd || isSaving}
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
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            className="add-participant-btn"
            onClick={handleSubmit}
            disabled={isSaving}
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

      {localSuccessId && (
        <div className="splitbill-success-overlay">
          <div className="splitbill-success-modal">
            <h3>Split bill saved successfully!</h3>
            <p>Your split bill has been created.</p>

            <div className="success-btn-group">
              <button
                className="go-splitbill"
                onClick={() => {
                  onSuccess?.(localSuccessId, "view");
                }}
              >
                View Split Bill Detail
              </button>

              <button
                className="close-success"
                onClick={() => {
                  onSuccess?.(localSuccessId, "stay");
                  setLocalSuccessId(null);
                  onClose?.();
                }}
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}