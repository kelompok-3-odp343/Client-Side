import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import TransactionDetailModal from "../../../shared/components/TransactionDetailModal";
import TransactionHistory from "../../../shared/components/TransactionHistory";
import "../styles/deposit.css";
import depositIcon from "../../../assets/images/deposit-icon.png";
import { getTimeDeposits, getTimeDepositTransactions } from "../api/time-deposits.api";

export default function Deposits() {
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getLastMonths = () => {
    const now = new Date();
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        label: d.toLocaleString("en-US", { month: "short" }),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }
    return arr.reverse();
  };

  const [months] = useState(getLastMonths());
  const [selectedMonth, setSelectedMonth] = useState(
    getLastMonths()[getLastMonths().length - 1]
  );

  const fetchDeposits = async () => {
    try {
      const responseData = await getTimeDeposits();
      const resApi = responseData.data;

      const formattedData = {
        totalBalance: resApi.total_balance,
        totalCount: resApi.count_accounts,
        deposits: resApi.items.map((item) => ({
          id: item.item_id,
          title: `Account ${item.deposit_account_number}`,
          balance: item.balance,
          interest: `${item.interest_rate}%`,
          opening: new Date(item.maturity_date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          period: `${item.tenor_months} months`,
          date: new Date(item.maturity_date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: item.status,
          account_number: item.deposit_account_number,
        })),
      };

      setDepositsData(formattedData);
    } catch (err) {
      console.error("❌ Error get deposits:", err);
    }
  };

  const handleSelectedMonth = async (m) => {
    setSelectedMonth(m);

    try {
      const accountNumber = depositsData?.deposits?.[0]?.account_number;
      if (!accountNumber) return;

      const data = await getTimeDepositTransactions({
        month: m.month,
        year: m.year,
        accountNumber: "",
      });

      if (!data?.transactions) {
        setTransactions([]);
        return;
      }

      const grouped = mapTransactionsToGroups(data.transactions);
      setTransactions(grouped);
    } catch (err) {
      console.error("Gagal fetch transaksi deposit:", err);
    }
  };

  const mapTransactionsToGroups = (flat) => {
    const groups = {};
    flat.forEach((trx) => {
      let d;
      try {
        const dateStr = trx.transactionDate;
        if (!dateStr) return;
        
        d = new Date(dateStr);
        
        if (isNaN(d.getTime())) {
          console.warn('Invalid date:', dateStr);
          return;
        }
      } catch (e) {
        console.warn('Error parsing date:', trx.transactionDate, e);
        return;
      }

      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      groups[key].items.push({
        transactionId: trx.transactionId,
        transactionDate: trx.transactionDate,
        type: trx.transactionType,
        detail: trx.partyName,
        amount: (trx.debit_credit === "C" ? "+" : "-") + trx.amount,
        jenisTransaksi: trx.debit_credit === "D" ? "Pengeluaran" : "Pemasukan",
        debit_credit: trx.debit_credit,
        partyName: trx.partyName,
        partyDetail: trx.partyDetail,
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    if (depositsData?.deposits?.length) {
      handleSelectedMonth(selectedMonth);
    }
  }, [depositsData]);

  return (
    <div className="deposit-page">
      <Navbar />

      <main className="deposit-container">
        {/* LEFT PANEL */}
        <section className="deposit-left">
          <div className="section-header">
            <h2 className="lg-title">Deposits Information</h2>
            <p className="lg-sub">Lock the Rate, Unlock the Growth</p>
          </div>

          <div className="deposit-summary-card fancy">
            <div className="deposit-summary-left">
              <div className="deposit-icon-circle">
                <img src={depositIcon} alt="Deposit Icon" />
              </div>
            </div>
            <div className="deposit-summary-right">
              <h3 className="summary-title">Time Deposits</h3>
              <p className="summary-label">Total Balance</p>
              <p className="summary-balance">
                Rp{depositsData?.totalBalance?.toLocaleString()}
              </p>
              <div className="summary-divider" />
              <p className="summary-sub">
                You have {depositsData?.totalCount} Time Deposits
              </p>
            </div>
          </div>

          <h3 className="your-deposit-title">Your Time Deposits</h3>
          <div className="deposit-grid">
            {depositsData?.deposits?.map((d) => (
              <DepositCard key={d.id} {...d} />
            ))}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="deposit-right">
          <TransactionHistory
            transactions={transactions}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={handleSelectedMonth}
            themeColor="#FFE8B0"
            title="Transaction History"
            onTransactionClick={(item) => {
              setSelectedTransaction(item);
              setShowDetailModal(true);
            }}
            productType="DEP"
            showDownloadButton={true}
            onDownload={() => console.log("Download deposits transactions")}
            emptyMessage="No transactions available"
          />
        </section>
      </main>

      {showDetailModal && selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
          productType="DEP"
        />
      )}
    </div>
  );
}

/* Deposit Card */
function DepositCard({ title, balance, date, interest, opening, period }) {
  const [day, month, year] = date.split(" ");
  return (
    <div className="deposit-card">
      <h4 className="deposit-title">{title}</h4>
      <p className="deposit-balance">
        Balance:
        <br />
        <strong>Rp{balance.toLocaleString()}</strong>
      </p>

      <div className="circle-container">
        <div className="circle-ring">
          <div className="circle-inner">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
            <span className="year">{year}</span>
          </div>
        </div>
      </div>

      <hr />
      <div className="deposit-info">
        <p>
          <span>Interest</span>
          <span>{interest}</span>
        </p>
        <p>
          <span>Opening date</span>
          <span>{opening}</span>
        </p>
        <p>
          <span>Period</span>
          <span>{period}</span>
        </p>
      </div>
    </div>
  );
}