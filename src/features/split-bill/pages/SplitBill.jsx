import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import "../styles/split-bill.css";
import { fetchSplitBills } from "../api/split-bill.api";

export default function SplitBill() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSplitBills();
      if (!data || data.length === 0) {
        // fallback dummy data
        setBills([
          {
            split_bill_id: 1,
            split_bill_title: "Kopi Nako",
            total_bill: 2000000,
            ref_id: "20251023054245000290",
            created_time: new Date().toISOString(),
            members: [
              { member_name: "Ulion Pardede", amount: 25000, status: "Paid" },
              { member_name: "Ulion Simanjuntak", amount: 25000, status: "Unpaid" },
              { member_name: "Della Puspita", amount: 25000, status: "Unpaid" },
              { member_name: "Ridwan Surya Ghani", amount: 25000, status: "Unpaid" },
              { member_name: "Ulion Alberto P. Pardede", amount: 25000, status: "Paid" },
              { member_name: "Ulion Tampubolon", amount: 25000, status: "Paid" },
            ],
          },
          {
            split_bill_id: 2,
            split_bill_title: "Dinner at Sushi Tei",
            total_bill: 750000,
            ref_id: "20251023054245000291",
            created_time: new Date().toISOString(),
            members: [
              { member_name: "Rudi Hartono", amount: 250000, status: "Paid" },
              { member_name: "Cindy Oktavia", amount: 250000, status: "Unpaid" },
              { member_name: "Tomi Kurniawan", amount: 250000, status: "Unpaid" },
            ],
          },
        ]);
      } else {
        setBills(data);
      }
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

        <div className="sb-grid">
          {bills.map((bill, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const color = cardColors[(row + col) % cardColors.length];
            const membersToShow = bill.members.slice(0, 3);
            const extraCount = Math.max(0, bill.members.length - membersToShow.length);

            return (
              <div
                key={bill.split_bill_id}
                className="sb-card"
                style={{ "--color": color }}
              >
                <div className="sb-card-header">
                  <h3>{bill.split_bill_title}</h3>
                  <p>
                    <span>Total Bill</span>
                    <span className="amount">
                      Rp {Number(bill.total_bill).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>

                <div className="sb-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (bill.members.filter((m) => m.status === "Paid").length /
                            Math.max(1, bill.members.length)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="sb-members">
                  {membersToShow.map((m, idx) => (
                    <div key={idx} className="sb-member-row">
                      <span>{m.member_name}</span>
                      <span>
                        Rp{Number(m.amount).toLocaleString("id-ID")}{" "}
                        <span
                          className={`status ${
                            m.status === "Paid" ? "paid" : "unpaid"
                          }`}
                        >
                          {m.status}
                        </span>
                      </span>
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div className="sb-member-more">+{extraCount} more</div>
                  )}
                </div>

                <div className="sb-actions sb-actions-right">
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/splitbill/detail/${bill.split_bill_id}`, {
                        state: { bill, color },
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
      </main>
    </div>
  );
}