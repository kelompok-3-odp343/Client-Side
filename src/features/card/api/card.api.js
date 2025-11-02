import axios from "axios";
import { DUMMY_CARDS, DUMMY_TRX_HISTORY } from "../data/card.dummy";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Fetch all cards (real API or dummy fallback)
 */
export async function fetchAllCards() {
  try {
    const res = await api.get("/api/cards");
    if (res.data?.data?.length) return res.data.data;
    return DUMMY_CARDS;
  } catch {
    return DUMMY_CARDS;
  }
}

/**
 * Fetch transaction history by month, year, and account number
 * Fallback ke dummy data jika API gagal
 */
export async function fetchTransactionHistory({ month, year, accountNumber }) {
  try {
    const token = sessionStorage.getItem("token");
    const payload = { month, year, accountNumber };

    const resp = await api.post(`/api/v1/transaction-history`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    // Validasi struktur dari backend
    if (resp.data?.transaction?.length) return resp.data;
    if (resp.data?.transactions?.length) return resp.data;
  } catch (error) {
    console.warn("API unavailable, using dummy", error?.message);
  }

  // --- Dummy fallback ---
  const dummyRecords = DUMMY_TRX_HISTORY[accountNumber];
  if (!dummyRecords) return { transaction: [] };

  const found = dummyRecords.find(
    (r) => Number(r.month) === Number(month) && String(r.year) === String(year)
  );

  if (!found) return { transaction: [] };

  // Format mirip response backend
  return {
    month: found.month,
    year: found.year,
    productType: found.productType,
    productSubCategory: found.productSubCategory,
    transaction: found.transaction,
  };
}