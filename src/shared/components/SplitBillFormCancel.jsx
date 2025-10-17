import React from "react";
import "../styles/components/split-bill-form-cancel.css";

export default function SplitBillFormCancel({ onConfirm, onCancel }) {
  return (
    <div className="splitbill-cancel-overlay">
      <div className="splitbill-cancel-modal">
        <h3 className="splitbill-cancel-text">
          Are you sure you want to discard this form?
        </h3>
        <div className="splitbill-cancel-btn-group">
          <button className="splitbill-cancel-yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="splitbill-cancel-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
