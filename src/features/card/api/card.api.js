import axios from "axios";
import { DUMMY_CARDS, DUMMY_TRX_HISTORY } from "../data/card.dummy";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchAllCards() {
  try {
    const res = await api.post("/api/v1/account", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      }
    });
    if (res.data?.data?.length) return res.data.data;

  } catch {
    return null
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


    const respTrxHistory = await api.post(`/api/v1/trx-history`, payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (respTrxHistory.data?.transaction?.length) return respTrxHistory.data;
    if (respTrxHistory.data?.transactions?.length) return respTrxHistory.data;
  } catch (error) {
    console.warn("API unavailable, using dummy", error?.message);
  }

  const dummyRecords = DUMMY_TRX_HISTORY[accountNumber];
  if (!dummyRecords) return { transaction: [] };

  const found = dummyRecords.find(
    (r) => Number(r.month) === Number(month) && String(r.year) === String(year)
  );

  if (!found) return { transaction: [] };

  return {
    month: found.month,
    year: found.year,
    productType: found.productType,
    productSubCategory: found.productSubCategory,
    transaction: found.transaction,
  };
}