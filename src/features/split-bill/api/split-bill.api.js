import axios from "axios";
import SPLIT_BILL_DUMMY_DATA from "../data/split-bill.dummy";

/**
 * Normalisasi data split bill agar aman digunakan di frontend
 */
function normalizeBill(b) {
  const bill = {
    ...b,
    members: (b.members || []).map((m) => ({
      ...m,
      amount:
        typeof m.amount === "string"
          ? Number(m.amount.replace(/[^\d.-]/g, ""))
          : Number(m.amount || 0),
      status: m.status || "Unpaid",
    })),
  };

  bill.remaining_bill = bill.members
    .filter((m) => m.status !== "Paid")
    .reduce((s, m) => s + (Number(m.amount) || 0), 0);

  return bill;
}

/**
 * Ambil data Split Bill dari backend
 * Fallback otomatis ke dummy data bila API gagal
 */
export async function fetchSplitBills() {
  try {
    const res = await axios.get("/api/split-bill/detail/SB001", {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;
    if (data.status && data.data) {
      const arr = Array.isArray(data.data) ? data.data : [data.data];
      return arr.map(normalizeBill);
    } else {
      console.warn("⚠️ Invalid response format. Using dummy data.");
      return SPLIT_BILL_DUMMY_DATA.map(normalizeBill);
    }
  } catch (error) {
    console.error("❌ API request failed:", error.message);
    return SPLIT_BILL_DUMMY_DATA.map(normalizeBill);
  }
}