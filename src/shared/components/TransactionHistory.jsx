import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/transaction-history.css";

/**
 * TransactionHistory Component
 * 
 * Komponen fleksibel untuk menampilkan riwayat transaksi dengan tema yang dapat disesuaikan
 * 
 * @param {Array} transactions - Array of transaction groups [{date, items: [...]}]
 * @param {Array} months - Array of available months [{label, month, year}]
 * @param {Object} selectedMonth - Currently selected month {label, month, year}
 * @param {Function} onMonthChange - Callback when month is changed
 * @param {String} themeColor - Primary color for the component (default: "#6dddd0")
 * @param {String} title - Title for the section (default: "Transaction History")
 * @param {Function} onTransactionClick - Callback when a transaction is clicked
 * @param {String} productType - Product type for transaction detail modal ("SAV", "DEP", "LFG", "DPLK")
 * @param {Boolean} showDownloadButton - Show/hide download button (default: false)
 * @param {Function} onDownload - Callback for download action
 * @param {Boolean} loading - Loading state
 * @param {String} emptyMessage - Message to show when no transactions
 */
export default function TransactionHistory({
  transactions = [],
  months = [],
  selectedMonth = null,
  onMonthChange,
  themeColor = "#6dddd0",
  title = "Transaction History",
  onTransactionClick,
  productType = "SAV",
  showDownloadButton = false,
  onDownload,
  loading = false,
  emptyMessage = "No transactions available",
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const handleMonthClick = (month) => {
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  const handleTransactionClick = (transaction) => {
    if (onTransactionClick) {
      onTransactionClick(transaction);
    }
  };

  if (loading) {
    return (
      <div className="trx-history-container" style={{ "--theme-color": themeColor }}>
        <div className="trx-history-loading">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="trx-history-container" style={{ "--theme-color": themeColor }}>
      {/* Header */}
      <div className="trx-history-header">
        <h3 className="trx-history-title">{title}</h3>
        {showDownloadButton && onDownload && (
          <button 
            className="trx-history-download-btn" 
            onClick={onDownload}
            aria-label="Download transactions"
          >
            <i className="fas fa-download"></i>
          </button>
        )}
      </div>

      {/* Month Filter */}
      {months.length > 0 && (
        <div className="trx-history-months">
          {months.map((month) => {
            const isActive =
              selectedMonth?.month === month.month &&
              selectedMonth?.year === month.year;

            return (
              <button
                key={`${month.month}-${month.year}`}
                className={`trx-month-btn ${isActive ? "active" : ""}`}
                onClick={() => handleMonthClick(month)}
                onMouseEnter={() => setHoveredMonth(month)}
                onMouseLeave={() => setHoveredMonth(null)}
                style={{
                  backgroundColor: isActive ? themeColor : undefined,
                  color: isActive ? "#fff" : undefined,
                  borderColor: isActive ? themeColor : undefined,
                }}
              >
                {month.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Transaction List */}
      <div className="trx-history-list">
        {transactions.length > 0 ? (
          transactions.map((group, groupIndex) => (
            <div key={`${group.date}-${groupIndex}`} className="trx-group">
              <p className="trx-group-date">
                <strong>{group.date}</strong>
              </p>
              <hr className="trx-group-divider" />

              {group.items?.map((item, itemIndex) => {
                const isCredit = 
                  item.debit_credit === "C" || 
                  item.jenisTransaksi === "Pemasukan" ||
                  (typeof item.amount === "string" && item.amount.startsWith("+"));

                const isDebit =
                  item.debit_credit === "D" ||
                  item.jenisTransaksi === "Pengeluaran" ||
                  (typeof item.amount === "string" && item.amount.startsWith("-"));

                return (
                  <div
                    key={item.transactionId || `${groupIndex}-${itemIndex}`}
                    className="trx-item"
                    onClick={() => handleTransactionClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTransactionClick(item);
                      }
                    }}
                  >
                    <div className="trx-item-left">
                      <p className="trx-item-type">
                        {item.type || item.transactionType || "-"}
                      </p>
                      <p className="trx-item-detail">
                        {item.detail || item.partyName || "-"}
                      </p>
                    </div>

                    <div className="trx-item-right">
                      <span
                        className={`trx-item-amount ${
                          isCredit ? "credit" : isDebit ? "debit" : ""
                        }`}
                      >
                        {item.amount}
                      </span>

                      {/* Split Bill Button (only for SAV product and debit transactions) */}
                      {productType === "SAV" && isDebit && (
                        <button
                          className="trx-split-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.split_bill_id) {
                              // Navigate to split bill detail
                              window.location.href = `/splitbill/detail?id=${item.split_bill_id}`;
                            } else {
                              // Trigger parent to open split bill form
                              if (onTransactionClick) {
                                // First open detail modal, then user can click split bill there
                                onTransactionClick(item);
                              }
                            }
                          }}
                          style={{
                            borderColor: themeColor,
                            color: themeColor,
                          }}
                        >
                          {item.split_bill_id ? "View Split Bill" : "Split Bill?"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="trx-history-empty">
            <p>
              {emptyMessage}
              {selectedMonth && ` for ${selectedMonth.label} ${selectedMonth.year}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

TransactionHistory.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          transactionId: PropTypes.string,
          transactionDate: PropTypes.string,
          type: PropTypes.string,
          transactionType: PropTypes.string,
          detail: PropTypes.string,
          partyName: PropTypes.string,
          amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          debit_credit: PropTypes.string,
          jenisTransaksi: PropTypes.string,
          split_bill_id: PropTypes.string,
        })
      ),
    })
  ),
  months: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    })
  ),
  selectedMonth: PropTypes.shape({
    label: PropTypes.string,
    month: PropTypes.number,
    year: PropTypes.number,
  }),
  onMonthChange: PropTypes.func,
  themeColor: PropTypes.string,
  title: PropTypes.string,
  onTransactionClick: PropTypes.func,
  productType: PropTypes.oneOf(["SAV", "DEP", "LFG", "DPLK"]),
  showDownloadButton: PropTypes.bool,
  onDownload: PropTypes.func,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};