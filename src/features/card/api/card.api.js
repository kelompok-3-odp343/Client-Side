import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchAllCards() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post("/api/v1/account", {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      }
    });

    const result = res?.data?.data;

    return result;

  } catch (error) {
    console.error("Failed to fetch cards:", error);
    throw error;
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

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp = await api.post("/api/v1/trx-history", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    const trx = resp?.data?.transaction;

    if (!Array.isArray(trx)) {
      return { transactions: [] };
    }

    return { transactions: trx };

  } catch (error) {
    console.error("Failed to fetch transaction history:", error?.message);
    return { transactions: [] };
  }
}