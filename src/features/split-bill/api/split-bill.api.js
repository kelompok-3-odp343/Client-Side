import axios from "axios";
import SPLIT_BILL_DUMMY_DATA from "../data/split-bill.dummy";

let DUMMY_STORAGE = [...SPLIT_BILL_DUMMY_DATA]; // penyimpanan sementara di memori
let API_WORKED_BEFORE = false;

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
 * Ambil data Split Bill (utama dari API, fallback ke dummy)
 */
export async function fetchSplitBills() {
  try {
    const res = await axios.get("/api/split-bill/all", {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;
    if (data.status && Array.isArray(data.data)) {
      console.info("✅ Data diambil dari API");
      return data.data.map(normalizeBill);
    }

    console.warn("⚠️ Format API tidak sesuai. Gunakan dummy.");
    return DUMMY_STORAGE.map(normalizeBill);
  } catch {
    console.warn("ℹ️ Tidak dapat menghubungi API, gunakan dummy data.");
    return DUMMY_STORAGE.map(normalizeBill);
  }
}

export async function getSplitBillById(id) {
  const found = DUMMY_STORAGE.find((b) => b.split_bill_id === id);
  return found ? normalizeBill(found) : null;
}

export async function updateSplitBillStatus(split_bill_id, updatedMembers) {
  const idx = DUMMY_STORAGE.findIndex((b) => b.split_bill_id === split_bill_id);
  if (idx !== -1) {
    DUMMY_STORAGE[idx].members = updatedMembers;
    // hitung ulang remaining_bill
    DUMMY_STORAGE[idx].remaining_bill = updatedMembers
      .filter((m) => m.status !== "Paid")
      .reduce((s, m) => s + (Number(m.amount) || 0), 0);
  }
  return DUMMY_STORAGE[idx];
}

export async function createSplitBill(payload) {
  const newBill = {
    accountNumber: payload.accountNumber,
    transactionId: payload.transactionId,
    splitBillTitle: payload.splitBillTitle,
    currency: "IDR", // hardcode sesuai instruksi
    totalAmount: payload.totalAmount,
    billMembers: payload.billMembers,
  };

  try {
    const token = sessionStorage.getItem("token")
    const res = await axios.post("/api/split-bill/add", newBill, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        "ngrok-skip-browser-warning": "true"
      },
      timeout: 4000,
    });

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
  } catch (err) {
    console.warn("⚠️ Gagal API, fallback dummy:", err.message);
  }

  if (API_WORKED_BEFORE) {
    throw new Error("Server sedang maintance, silahkan coba beberapa saat lagi");
  }

  const _dummyNew = {
    split_bill_id: "SB" + String(DUMMY_STORAGE.length + 1).padStart(3, "0"),
    split_bill_title: newBill.splitBillTitle,
    total_bill: newBill.totalAmount,
    created_time: new Date().toISOString(),
    ref_id: newBill.transactionId,
    members: newBill.billMembers.map(m => ({
      member_name: m.memberName,
      amount: m.amountShare,
      status: "Unpaid",
    })),
  };

  DUMMY_STORAGE.unshift(_dummyNew);
  return _dummyNew;
}