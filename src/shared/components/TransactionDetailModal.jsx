import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowUpRight, ArrowDownLeft, DollarSign, Receipt } from "lucide-react";
import "../styles/components/transaction-detail-modal.css";

const TransactionDetailModal = ({
  transaction,
  onClose,
  onSplitBill,
  productType = "SAV", // SAV, LFG, DEP, DPLK
}) => {
  const navigate = useNavigate();

  if (!transaction) return null;

  const isExpense = transaction.debit_credit === "D" || transaction.jenisTransaksi === "Pengeluaran";
  const canSplitBill = isExpense && productType === "SAV";
  const hasSplitBill = transaction.split_bill_id;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    const numAmount = typeof amount === "string" 
      ? Number(amount.replace(/[^\d-]/g, ""))
      : Number(amount);
    return `Rp ${Math.abs(numAmount).toLocaleString("id-ID")}`;
  };

  const getTransactionIcon = () => {
    const type = transaction.transactionType?.toLowerCase() || transaction.type?.toLowerCase() || "";
    
    if (type.includes("transfer")) {
      return isExpense ? <ArrowUpRight size={32} /> : <ArrowDownLeft size={32} />;
    }
    if (type.includes("qris") || type.includes("payment")) {
      return <Receipt size={32} />;
    }
    return <DollarSign size={32} />;
  };

  const handleSplitBillAction = () => {
    if (hasSplitBill) {
      navigate(`/splitbill/detail`, {
        state: {
          splitBillId: transaction.split_bill_id,
          color: "#6dddd0",
        },
      });
    } else {
      onSplitBill?.(transaction);
    }
    onClose();
  };

  return (
    <div className="trx-modal-overlay" onClick={onClose}>
      <div className="trx-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="trx-modal-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="trx-modal-header">
          <div className={`trx-modal-icon ${isExpense ? "expense" : "income"}`}>
            {getTransactionIcon()}
          </div>
          <h2 className="trx-modal-title">Transaction Detail</h2>
        </div>

        <div className="trx-modal-body">
          <div className="trx-detail-row">
            <span className="trx-detail-label">Transaction Type</span>
            <span className="trx-detail-value">
              {transaction.transactionType || transaction.type || "-"}
            </span>
          </div>

          <div className="trx-detail-row">
            <span className="trx-detail-label">Date & Time</span>
            <span className="trx-detail-value">
              {formatDate(transaction.transactionDate)}
            </span>
          </div>

          <div className="trx-detail-row">
            <span className="trx-detail-label">Transaction ID</span>
            <span className="trx-detail-value trx-id">
              {transaction.transactionId || "-"}
            </span>
          </div>

          <div className="trx-detail-row">
            <span className="trx-detail-label">Party Name</span>
            <span className="trx-detail-value">
              {transaction.partyName || transaction.detail || "-"}
            </span>
          </div>

          {transaction.partyDetail && (
            <div className="trx-detail-row">
              <span className="trx-detail-label">Description</span>
              <span className="trx-detail-value">
                {transaction.partyDetail}
              </span>
            </div>
          )}

          <div className="trx-detail-divider" />

          <div className="trx-detail-row trx-amount-row">
            <span className="trx-detail-label">Amount</span>
            <span className={`trx-detail-amount ${isExpense ? "expense" : "income"}`}>
              {isExpense ? "- " : "+ "}
              {formatAmount(transaction.amount)}
            </span>
          </div>

          {canSplitBill && (
            <>
              <div className="trx-detail-divider" />
              <button
                className={`trx-split-bill-btn ${hasSplitBill ? "view" : "create"}`}
                onClick={handleSplitBillAction}
              >
                {hasSplitBill ? "View Split Bill" : "Split this Bill"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;