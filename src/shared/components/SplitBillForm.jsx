import React, { useState } from "react";
import "../styles/components/split-bill-form.css";
import SplitBillFormCancel from "./SplitBillFormCancel"; // popup component
import { Plus } from "lucide-react";

export default function SplitBillForm({ onClose, transaction }) {
  const [participants, setParticipants] = useState([
    {
      id: Date.now(),
      participantName: "Evan Edrin",
      participantAmount: "Rp 15.000",
    },
  ]);

  const [participantName, setParticipantName] = useState("");
  const [participantAmount, setParticipantAmount] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  function handleAddParticipant(participant) {
    setParticipants((prev) => [...prev, participant]);
  }

  const handleDeleteParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!participantName || !participantAmount) return;

    const newParticipant = {
      id: Date.now(),
      participantName,
      participantAmount,
    };

    handleAddParticipant(newParticipant);
    setParticipantAmount("");
    setParticipantName("");
  }

  return (
    <div className="splitbill-modal">
      <div className="splitbill-container">
        <h2 className="title">Split Bill Form</h2>
        <hr />

        {/* Transaction Info */}
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

        {/* Bill Info */}
        <div className="bill-info-container">
          <div className="bill-info">
            <p>
              <strong>Bill Name :</strong> {transaction.detail}
            </p>
            <p>
              <strong>Total Bill :</strong> {transaction.amount}
            </p>
          </div>
        </div>

        {/* Participant Section */}
        <div className="participant-secition-container">
          <div className="participant-section">
            <div className="participant-header">
              <span>No</span>
              <span>Bill Members</span>
              <span>Amount Per Member</span>
            </div>

            {participants.map((p, i) => (
              <div key={p.id} className="participant-row">
                <span>{i + 1}</span>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Rp..."
                  value={participantAmount}
                  onChange={(e) => setParticipantAmount(e.target.value)}
                />
                {i === participants.length - 1 && (
                  <div className="btn-container">
                    <button
                      type="button"
                      className="rmv-btn"
                      onClick={() => handleDeleteParticipant(p.id)}
                    >
                      <i className="bi bi-dash-circle"></i>
                    </button>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={() =>
                        handleAddParticipant({
                          id: Date.now(),
                          participantName: "",
                          participantAmount: "",
                        })
                      }
                    >
                      <i className="bi bi-plus-circle"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="add-participant-btn-container">
          <button
            className="cancel-add-participant"
            onClick={() => setShowCancelPopup(true)}
          >
            Cancel
          </button>
          <button className="add-participant-btn" onClick={handleSubmit}>
            Add Participant
          </button>
        </div>
      </div>

      {/* Popup Cancel */}
      {showCancelPopup && (
        <SplitBillFormCancel
          onConfirm={onClose} // keluar dari form
          onCancel={() => setShowCancelPopup(false)} // kembali ke form
        />
      )}
    </div>
  );
}
