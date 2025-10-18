import axios from "axios";
import SPLIT_BILL_DUMMY_DATA from "../data/split-bill.dummy";

let DUMMY_STORAGE = [...SPLIT_BILL_DUMMY_DATA]; // penyimpanan sementara di memori

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

/**
 * Buat Split Bill baru
 * - Prioritas: kirim ke API jika BE aktif
 * - Fallback: tulis ke dummy storage lokal
 */
export async function createSplitBill(payload) {
  const newBill = {
    split_bill_id: "SB" + String(DUMMY_STORAGE.length + 1).padStart(3, "0"),
    split_bill_title: payload.split_bill_title,
    total_bill: payload.total_bill,
    created_time: new Date().toISOString(),
    ref_id: payload.ref_id,
    members: payload.members,
  };

  try {
    const res = await axios.post("/api/split-bill/create", newBill, {
      headers: { "Content-Type": "application/json" },
      timeout: 3000,
    });

    if (res.status >= 200 && res.status < 300) {
      console.info("✅ Split Bill berhasil dikirim ke API backend.");
      return normalizeBill(res.data.data || newBill);
    }

    console.warn("⚠️ API merespons tidak sesuai. Gunakan dummy.");
  } catch (err) {
    console.warn("⚠️ Gagal kirim ke API, fallback ke dummy:", err.message);
  }

  // fallback ke dummy lokal
  DUMMY_STORAGE.unshift(newBill);
  return normalizeBill(newBill);
}