import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/transaction-history.css";

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

  return (
    <div className="trx-history-container" style={{ "--theme-color": themeColor }}>
      <div className="trx-history-header">
        <h3 className="trx-history-title">{title}</h3>
        {showDownloadButton && onDownload && (
          <button 
            className="trx-history-download-btn" 
            onClick={onDownload}
            aria-label="Download transactions"
            disabled={loading} 
          >
            <i className="fas fa-download"></i>
          </button>
        )}
      </div>

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
                disabled={loading} 
                style={{
                  backgroundColor: isActive ? themeColor : undefined,
                  color: isActive ? "#fff" : undefined,
                  borderColor: isActive ? themeColor : undefined,
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading && !isActive ? 0.5 : 1
                }}
              >
                {month.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="trx-history-list-container">
        
        {loading && (
          <div className="trx-loading-overlay">
            <div className="trx-spinner" style={{ borderTopColor: themeColor }}></div>
          </div>
        )}

        <div className="trx-history-list" style={{ opacity: loading ? 0.4 : 1 }}>
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
                      onClick={() => !loading && handleTransactionClick(item)}
                      role="button"
                      tabIndex={0}
                      style={{ cursor: loading ? "default" : "pointer" }}
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

                        {productType === "SAV" && isDebit && (
                          <button
                            className="trx-split-btn"
                            disabled={loading}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.split_bill_id) {
                                window.location.href = `/splitbill/detail?id=${item.split_bill_id}`;
                              } else {
                                if (onTransactionClick) onTransactionClick(item);
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
                {!loading && (
                   <>
                     {emptyMessage}
                     {selectedMonth && ` for ${selectedMonth.label} ${selectedMonth.year}`}
                   </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TransactionHistory.propTypes = {
  transactions: PropTypes.array,
  months: PropTypes.array,
  selectedMonth: PropTypes.object,
  onMonthChange: PropTypes.func,
  themeColor: PropTypes.string,
  title: PropTypes.string,
  onTransactionClick: PropTypes.func,
  productType: PropTypes.string,
  showDownloadButton: PropTypes.bool,
  onDownload: PropTypes.func,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};