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
    console.log('xcxcz', result)

    if (Array.isArray(result) && result.length > 0) {
      return result;
    }

    return [];

  } catch (error) {
    console.warn("⚠️ API failed, using dummy cards:", error?.message);
    return [];
  }
}

export async function fetchTransactionHistory({ month, year, accountNumber }) {
  try {
    const payload = {
      month,
      year,
      accountNumber,
      productType: "SVG"
    };

    const token = sessionStorage.getItem("token");
    const resp = await api.post("/api/v1/trx-history", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    const trx = resp?.data?.transaction;

    if (Array.isArray(trx)) {
      return { transactions: trx };
    }

    return { transactions: [] };

  } catch (error) {
    console.warn("API trx failed:", error?.message);
    return { transactions: [] };
  }
}