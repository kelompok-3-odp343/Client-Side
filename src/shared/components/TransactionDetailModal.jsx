import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/components/transaction-detail-modal.css";

import billPaymentIcon from "../../assets/images/bill_payment.png";
import qrisIcon from "../../assets/images/qris.png";
import vaIcon from "../../assets/images/va.png";
import transferIcon from "../../assets/images/transfer.png";
import ewalletIcon from "../../assets/images/e_wallet.png";

export default function TransactionDetailModal({
  transaction,
  onClose,
  onSplitBill,
  productType = "SAV",
}) {
  const navigate = useNavigate();
  if (!transaction) return null;

  const isExpense =
    transaction.debit_credit === "D" ||
    transaction.jenisTransaksi === "Pengeluaran";

  const canSplitBill = isExpense && productType === "SAV";
  const hasSplitBill = transaction.split_bill_id;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    const num =
      typeof amount === "string"
        ? Number(amount.replace(/[^\d-]/g, ""))
        : Number(amount);
    return `Rp ${Math.abs(num).toLocaleString("id-ID")}`;
  };

  const getIcon = () => {
    const t = (transaction.transactionType || "").toLowerCase();

    if (t.includes("qris")) return qrisIcon;
    if (t.includes("virtual") || t.includes("va")) return vaIcon;
    if (t.includes("transfer")) return transferIcon;
    if (t.includes("wallet")) return ewalletIcon;
    if (t.includes("payment")) return billPaymentIcon;

    return billPaymentIcon;
  };

  const handleSplit = () => {
    if (hasSplitBill) {
      navigate(`/splitbill/detail`, {
        state: { splitBillId: transaction.split_bill_id, color: "#6dddd0" },
      });
    } else {
      onSplitBill(transaction);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="trxv2-modal">

        <button className="trxv2-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="trxv2-icon-wrapper">
          <div className="trxv2-icon-circle">
            <img src={getIcon()} className="trxv2-icon" alt="trx-icon" />
          </div>
        </div>

        <p className="trxv2-party">
          {transaction.partyName || transaction.detail || "-"}
        </p>

        <p className="trxv2-sub">
          {transaction.transactionId
            ? `ID: ${transaction.transactionId}`
            : ""}
        </p>

        <p
          className={`trxv2-amount ${
            isExpense ? "trxv2-expense" : "trxv2-income"
          }`}
        >
          {isExpense ? "-" : "+"} {formatAmount(transaction.amount)}
        </p>

        {canSplitBill && (
          <button className="trxv2-split-btn" onClick={handleSplit}>
            {hasSplitBill ? "View Split Bill" : "Split Bill?"}
          </button>
        )}

        <div className="trxv2-divider"></div>

        <p className="trxv2-details-title">Transaction Details</p>

        <div className="trxv2-table">
          <div className="trxv2-row">
            <span>Transaction Type</span>
            <span>{transaction.transactionType || "-"}</span>
          </div>

          <div className="trxv2-row">
            <span>Date</span>
            <span>{formatDate(transaction.transactionDate)}</span>
          </div>

          <div className="trxv2-row">
            <span>Description</span>
            <span>{transaction.partyDetail || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}