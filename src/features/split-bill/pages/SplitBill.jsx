import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import { fetchSplitBills } from "../api/split-bill.api";
import "../styles/split-bill.css";

export default function SplitBill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSplitBills();

      if (!data || !data.data || data.data.length === 0) {
        setBills([]);
        setLoading(false);
        return;
      }

      setBills(data.data);
      setLoading(false);
    }
    loadData();
  }, []);

  const cardColors = ["#6dddd0", "#ffd367", "#9c7edc"];

  if (loading) return <div className="loading">Loading split bills...</div>;

  return (
    <div className="sb-container">
      <Navbar />
      <main className="sb-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <h1 className="sb-title">Split Bill</h1>
            <p className="sb-sub">Track and manage your shared expenses</p>
          </div>

          <div>
            <button
              className="add-split-btn"
              onClick={() => navigate("/detailmycard")}
              aria-label="Add split bill"
            >
              + Add Split Bill
            </button>
          </div>
        </div>

        {bills.length === 0 ? (
          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              color: "#888",
              fontSize: "1.1rem",
            }}
          >
            <p>No Split Bills found.</p>
          </div>
        ) : (
          <div className="sb-grid">
            {bills.map((bill, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const color = cardColors[(row + col) % cardColors.length];

              // normalized shape from API
              const members = bill.members || [];
              const membersToShow = members.slice(0, 3);
              const extraCount = Math.max(0, members.length - membersToShow.length);

              // progress: percent of members who have paid
              const paidCount = members.filter((m) => m.hasPaid || m.status === "Paid").length;
              const progressPercent = (paidCount / Math.max(1, members.length)) * 100;

              return (
                <div
                  key={bill.split_bill_id || bill.splitBillId || i}
                  className="sb-card"
                  style={{ "--color": color }}
                >
                  <div className="sb-card-header">
                    <h3>{bill.split_bill_title || bill.splitBillTitle}</h3>
                    <p>
                      <span>Total Bill</span>
                      <span className="amount">
                        Rp {Number(bill.total_bill || bill.totalBill).toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>

                  <div className="sb-progress">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="sb-members">
                    {membersToShow.map((m, idx) => (
                      <div key={m.member_id || idx} className="sb-member-row">
                        <span>{m.member_name}</span>
                        <span>
                          Rp{Number(m.amount || 0).toLocaleString("id-ID")}{" "}
                          <span
                            className={`status ${m.hasPaid || m.status === "Paid" ? "paid" : "unpaid"}`}
                          >
                            {m.hasPaid || m.status === "Paid" ? "Paid" : "Unpaid"}
                          </span>
                        </span>
                      </div>
                    ))}
                    {extraCount > 0 && <div className="sb-member-more">+{extraCount} more</div>}
                  </div>

                  <div className="sb-actions sb-actions-right">
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("/splitbill/detail", {
                          state: {
                            splitBillId: bill.split_bill_id || bill.splitBillId,
                            color,
                          },
                        })
                      }
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}