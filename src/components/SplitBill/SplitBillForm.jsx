import React, { useState, useEffect } from "react";
import "./SplitBillForm.css";
import { Plus } from "lucide-react";
import { fetchTransactionDetails, saveSplitBill } from "../../data/splitbill";

export default function SplitBillForm({ onClose, transactionId }) {
  const [transaction, setTransaction] = useState(null);
  const [participants, setParticipants] = useState([
    { name: "Evan Edrin", amount: "Rp 15.000" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails(transactionId).then(setTransaction);
    }
  }, [transactionId]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", amount: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transaction) return;

    setIsSaving(true);
    try {
      await saveSplitBill({
        transactionId: transaction.id,
        participants,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!transaction) return null;

  return (
    <div className="splitbill-modal">
      <div className="splitbill-container">
        <h2 className="title">Split Bill Form</h2>
        <hr />
        <div className="transaction-info">
          <div className="transaction-info-left-panel">
            <p><strong>Transaction ID :</strong> {transaction.id}</p>
          </div>
          <div className="transaction-info-right-panel">
            <p><strong>Transaction Date :</strong> {transaction.date}</p>
          </div>
        </div>

        <div className="bill-info-container">
          <div className="bill-info">
            <p><strong>Bill Name :</strong> {transaction.detail}</p>
            <p><strong>Total Bill :</strong> {transaction.amount}</p>
          </div>
        </div>

        <div className="participant-section-wrapper">
          <div className="participant-section">
            <div className="participant-header">
              <span>No</span>
              <span>Bill Members</span>
              <span>Amount Per Member</span>
            </div>

            {participants.map((p, i) => (
              <div key={i} className="participant-row">
                <span>{i + 1}</span>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={p.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Rp..."
                  value={p.amount}
                  onChange={(e) => handleChange(i, "amount", e.target.value)}
                />
                {i === participants.length - 1 && (
                  <button
                    type="button"
                    className="add-btn"
                    onClick={handleAddParticipant}
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="splitbill-btn-container">
          <button
            className="splitbill-btn"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Split Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}