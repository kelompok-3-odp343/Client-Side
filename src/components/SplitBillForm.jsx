import React, { useState } from "react";
import "../css/splitBillForm.css";
import { Plus } from "lucide-react";

export default function SplitBillForm({ onClose, transaction }) {
  const [participants, setParticipants] = useState([
    { name: "Evan Edrin", amount: "Rp 15.000" },
  ]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", amount: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Split bill saved!");
    onClose();
  };

  return (
    <div className="splitbill-modal">
      <div className="splitbill-container">
        <h2 className="title">Split Bill Form</h2>
        <div className="transaction-info">
          <p>
            <strong>Transaction ID :</strong> {transaction.id}
          </p>
          <p>
            <strong>Transaction Date :</strong> {transaction.date}
          </p>
        </div>

        <div className="bill-info">
          <p>
            <strong>Bill Name :</strong> {transaction.detail}
          </p>
          <p>
            <strong>Total Bill :</strong> {transaction.amount}
          </p>
        </div>

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

        <button className="add-participant-btn" onClick={handleSubmit}>
          Add Participant
        </button>
      </div>
    </div>
  );
}
