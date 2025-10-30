import axios from "axios";
import { DUMMY_CARDS, DUMMY_TRANSACTIONS } from "../data/card.dummy";
import { DUMMY_TRX_HISTORY } from "../data/trx_history.dummy";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
export async function fetchAllCards() {
  try {
    const res = await api.get("/api/cards");
    if (res.data?.data?.length) return res.data.data;
    return DUMMY_CARDS;
  } catch {
    return DUMMY_CARDS;
  }
}

export async function fetchCardTransactions(accountId) {
  try {
    const res = await api.get(`/api/cards/${accountId}/transactions`);
    if (res.data?.data?.length) return res.data.data;
    return DUMMY_TRANSACTIONS[accountId] || [];
  } catch {
    return DUMMY_TRANSACTIONS[accountId] || [];
  }
}

export async function fetchTransactionHistory({ month, year, accountNumber }) {
  try {
    const token = sessionStorage.getItem("token")
    const payload = {
      month,
      year,
      accountNumber
    };

    const respTrxHistory = await api.post(`/api/v1/transaction-history`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      }
    })

    return respTrxHistory.data;
  } catch (error) {
    console.error('err', error);
    return DUMMY_TRX_HISTORY[accountNumber] || { transactions: [] };
  }
}