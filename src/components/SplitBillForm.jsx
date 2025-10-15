import React, { useState } from "react";
import "../css/splitBillForm.css";
import { Plus } from "lucide-react";

export default function SplitBillForm({ onClose, transaction }) {
  const [participants, setParticipants] = useState([
    {
      id: Date.now(),
      participantName: "Evan Edrin",
      participantAmount: "Rp 15.000",
    },
  ]);
  const [participantName, setParticipantName] = useState();
  const [participantAmount, setParticipantAmount] = useState();
  // const [isParticipantEmpty, setParticipantEmpty] = useState(true);

  function handleAddParticipant(participant) {
    setParticipants((participants) => [...participants, participant]);
  }

  const handleDeleteParticipant = (id) => {
    setParticipants((participants) =>
      participants.filter((participants) => participants.id !== id)
    );
  };

  // function handleDeleteItem(id) {
  //   setItems((items) => items.filter((item) => item.id !== id));
  // }

  // const handleSetParticipant = () => {
  //   if (isParticipantEmpty == true) {
  //     isParticipantEmpty == false;
  //     setParticipantEmpty(isParticipantEmpty);
  //   } else {
  //     isParticipantEmpty == true;
  //     setParticipantEmpty(isParticipantEmpty);
  //   }
  // };

  // const handleChange = (index, field, value) => {
  //   const updated = [...participants];
  //   updated[index][field] = value;
  //   setParticipants(updated);
  // };

  function handleSubmit(e) {
    e.preventDefault();

    const newParticipant = {
      id: Date.now(),
      participantName,
      participantAmount,
    };

    handleAddParticipant(newParticipant);

    setParticipantAmount(0);
    setParticipantName("");
    // alert("Split bill saved!");
    // onClose();
  }

  return (
    <div className="splitbill-modal">
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
            <p>
              <strong>Bill Name :</strong> {transaction.detail}
            </p>
            <p>
              <strong>Total Bill :</strong> {transaction.amount}
            </p>
          </div>
        </div>

        <div className="participant-secition-container">
          {" "}
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
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  // onChange={(e) => handleChange(i, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Rp..."
                  value={participantAmount}
                  onChange={(e) => setParticipantAmount(Number(e.target.value))}
                  // onChange={(e) => handleChange(i, "amount", e.target.value)}
                />
                {i === participants.length - 1 && (
                  <div className="btn-container">
                    <button
                      type="button"
                      className="rmv-btn"
                      onClick={handleDeleteParticipant}
                    >
                      {/* <Plus size={18} /> */}
                      <i class="bi bi-dash-circle"></i>
                    </button>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleAddParticipant}
                    >
                      {/* <Plus size={18} /> */}
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="add-participant-btn-container">
          <button className="cancel-add-participant" onClick={onClose}>
            Cancel
          </button>
          <button className="add-participant-btn" onClick={handleSubmit}>
            Add Participant
          </button>
        </div>
      </div>
    </div>
  );
}
