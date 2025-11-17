import axios from "axios";
import { DUMMY_CARDS, DUMMY_TRX_HISTORY } from "../data/card.dummy";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchAllCards() {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.post("/api/v1/account", {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      }
    });

    const result = res?.data?.data;

    if (Array.isArray(result) && result.length > 0) {
      return result;
    }

    console.warn("⚠️ API returned empty card list, using dummy");
    return DUMMY_CARDS;

  } catch (error) {
    console.warn("⚠️ API failed, using dummy cards:", error?.message);
    return DUMMY_CARDS;
  }
}

export async function fetchTransactionHistory({ month, year, accountNumber }) {
  try {
    const token = sessionStorage.getItem("token");
    const resp = await api.post("/api/v1/trx-history", {
      month, year, accountNumber, productType: 'SVG'
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    const trx = resp?.data?.transactions || resp?.data?.transaction;

    if (Array.isArray(trx) && trx.length > 0) {
      return { transactions: trx };
    }

    console.warn("API empty trx, using dummy");
  } catch (error) {
    console.warn("API trx failed, using dummy:", error?.message);
  }

  // === DUMMY FALLBACK ===
  const dummy = DUMMY_TRX_HISTORY[accountNumber];

  if (!dummy) return { transactions: [] };

  const found = dummy.find(
    r => Number(r.month) === Number(month) && String(r.year) === String(year)
  );

  return found
    ? { transactions: found.transaction }
    : { transactions: [] };
}