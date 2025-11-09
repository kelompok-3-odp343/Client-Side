import React, { useEffect, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import "../styles/deposit.css";
import { Download } from "lucide-react";
import depositIcon from "../../../assets/images/deposit-icon.png";
import { getTimeDeposits, getTimeDepositTransactions } from "../api/time-deposits.api";

export default function Deposits() {
  const [depositsData, setDepositsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });
  const [showBalance, setShowBalance] = useState(true);

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
        accountNumber,
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

  const toISOFromDMY = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    const [dPart, tPart = "00:00:00"] = dateTimeStr.split("T");
    const [dd, mm, yyyy] = dPart.split("-");
    if (!dd || !mm || !yyyy) return null;
    return `${yyyy}-${mm}-${dd}T${tPart}`;
  };

  const mapTransactionsToGroups = (flat) => {
    const groups = {};
    flat.forEach((trx) => {
      const iso = toISOFromDMY(trx.transactionDate);
      const d = iso ? new Date(iso) : new Date(trx.transactionDate);
      const key = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      if (!groups[key]) {
        groups[key] = { date: key, sortKey: d.getTime(), items: [] };
      }

      groups[key].items.push({
        transactionId: trx.transactionId,
        type: trx.transactionType,
        detail: trx.partyName,
        amount: (trx.debit_credit === "C" ? "+" : "-") + trx.amount,
        jenisTransaksi: trx.debit_credit === "D" ? "Pengeluaran" : "Pemasukan",
      });
    });

    return Object.values(groups)
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  };

  useEffect(() => {
    const flatItems = transactions.flatMap((g) => g.items || []);
    const income = flatItems
      .filter((i) => typeof i.amount === "string" && i.amount.startsWith("+"))
      .reduce((s, i) => s + Number((i.amount || "").replace(/[^\d]/g, "")), 0);
    const expense = flatItems
      .filter((i) => typeof i.amount === "string" && i.amount.startsWith("-"))
      .reduce((s, i) => s + Number((i.amount || "").replace(/[^\d]/g, "")), 0);
    setChartData({ income, expense });
  }, [transactions]);

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
          <div className="transaction-header">
            <h2 className="lg-title">Transaction History</h2>
          </div>

          <div className="months">
            {months.map((m) => (
              <button
                key={m.month + "-" + m.year}
                className={
                  m.month === selectedMonth?.month &&
                    m.year === selectedMonth?.year
                    ? "active"
                    : ""
                }
                onClick={() => handleSelectedMonth(m)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="transaction-list-modern">
            {transactions.length ? (
              transactions.map((group) => (
                <div key={group.date} className="transaction-group">
                  <p className="transaction-date">
                    <strong>{group.date}</strong>
                  </p>
                  <hr />
                  {group.items.map((item) => (
                    <div
                      key={
                        item.transactionId ||
                        `${group.date}-${item.detail}-${item.amount}`
                      }
                      className="transaction-modern-item"
                    >
                      <div className="transaction-text">
                        <p className="transaction-type">{item.type}</p>
                        <p className="transaction-detail">{item.detail}</p>
                      </div>
                      <div className="transaction-amount-modern">
                        <span
                          className={`amount ${item.amount.startsWith("+") ? "credit" : "debit"
                            }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="no-data">
                No transactions available for {selectedMonth?.label}{" "}
                {selectedMonth?.year}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* Deposit Card */
function DepositCard({ title, balance, date, interest, opening, period }) {
  const [day, month, year] = date.split(" ");
  return (
    <div className="deposit-card">
      <h4 className="deposit-title">{title}</h4>
      <p className="deposit-balance">Balance:<br /><strong>Rp{balance.toLocaleString()}</strong></p>

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
        <p><span>Interest</span><span>{interest}</span></p>
        <p><span>Opening date</span><span>{opening}</span></p>
        <p><span>Period</span><span>{period}</span></p>
      </div>
    </div>
  );
}
