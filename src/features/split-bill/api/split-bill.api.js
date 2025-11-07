import axios from "axios";
import SPLIT_BILL_DUMMY_DATA from "../data/split-bill.dummy";

let DUMMY_STORAGE = [...SPLIT_BILL_DUMMY_DATA];
let API_WORKED_BEFORE = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function normalizeBill(b) {
  if (!b) return null;

  const bill = {
    split_bill_id: b.split_bill_id || b.id || null,
    split_bill_title: b.split_bill_title || b.title || b.splitBillTitle || "Untitled Bill",
    total_bill: b.total_bill || b.totalAmount || b.total_bill || 0,
    ref_id: b.ref_id || b.transactionId || b.refId || null,
    created_time: b.created_time || b.created_at || new Date().toISOString(),
    members: (b.members || b.billMembers || []).map((m) => ({
      member_name: m.member_name || m.memberName || "Unknown",
      amount:
        typeof m.amount === "string"
          ? Number(m.amount.replace(/[^\d.-]/g, "")) || 0
          : Number(m.amount || m.amountShare || 0),
      status: m.status || "Unpaid",
    })),
  };

  bill.remaining_bill = bill.members
    .filter((m) => m.status !== "Paid")
    .reduce((s, m) => s + (Number(m.amount) || 0), 0);

  return bill;
}

export async function fetchSplitBills() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await api.get("/api/split-bill", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        "ngrok-skip-browser-warning": "true",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Gagal memuat Split Bill:", error.message);
    return null;
  }
}

export async function getSplitBillById(splitBillId) {
  try {
    const token = sessionStorage.getItem("token");

    const res = await api.post(
      "/api/split-bill/detail",
      { splitBillId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Id": sessionStorage.getItem("user_id"),
          "Customer-Id": sessionStorage.getItem("cif"),
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = res.data?.data;
    if (!data) return null;

    return {
      split_bill_id: data.splitBillId,
      split_bill_title: data.splitBillTitle,
      total_bill: data.totalBill,
      ref_id: data.refId,
      created_time: data.createdTime,
      members: (data.members || []).map((m) => ({
        member_id: m.memberId,
        member_name: m.memberName,
        amount: m.amount,
        hasPaid: m.hasPaid,
        status: m.hasPaid ? "Paid" : "Unpaid",
      })),
    };
  } catch (error) {
    console.error("Gagal memuat detail Split Bill:", error.message);
    return null;
  }
}

export async function updateSplitBillStatus(split_bill_id, updatedMembers) {
  const idx = DUMMY_STORAGE.findIndex((b) => b.split_bill_id === split_bill_id);
  if (idx !== -1) {
    DUMMY_STORAGE[idx].members = updatedMembers.map((m) => ({
      ...m,
      amount: Number(m.amount) || 0,
      status: m.status || "Unpaid",
    }));

    DUMMY_STORAGE[idx].remaining_bill = updatedMembers
      .filter((m) => m.status !== "Paid")
      .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    return normalizeBill(DUMMY_STORAGE[idx]);
  }

  return null;
}

export async function createSplitBill(payload) {
  const newBill = {
    accountNumber: payload.accountNumber,
    transactionId: payload.transactionId,
    splitBillTitle: payload.splitBillTitle,
    currency: "IDR",
    totalAmount: payload.totalAmount,
    billMembers: payload.billMembers,
  };

  try {
    const token = sessionStorage.getItem("token");
    const res = await api.post("/api/split-bill/add", newBill, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 4000,
    });

    if (res.status >= 200 && res.status < 300) {
      API_WORKED_BEFORE = true;
      console.info("✅ Split bill berhasil disimpan via API");
      return normalizeBill(res.data?.data || res.data);
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
    members: newBill.billMembers.map((m) => ({
      member_name: m.memberName,
      amount: m.amountShare,
      status: "Unpaid",
    })),
  };

  DUMMY_STORAGE.unshift(_dummyNew);
  return normalizeBill(_dummyNew);
}