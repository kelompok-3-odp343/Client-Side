import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchLifeGoalsRevamp() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.get(`/api/v1/lifegoals`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res?.data) {
      throw new Error("Invalid response from API");
    }

    return res;
  } catch (error) {
    console.error("Failed to fetch life goals:", error?.message);
    throw error;
  }
}

export async function fetchLifeGoalDetail(accountNumber) {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post(`/api/v1/lifegoals-detail`, { accountNumber }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res?.data) {
      throw new Error("Invalid response from API");
    }

    return res;
  } catch (error) {
    console.error("Failed to fetch life goal detail:", error?.message);
    throw error;
  }
}

export async function fetchLifeGoalTransactions(accountNumber, month, year) {
  try {
    const token = sessionStorage.getItem("token");
    const payload = {
      accountNumber: accountNumber,
      month: month,
      year: year,
      productType: 'LFG'
    };

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post(`/api/v1/trx-history`, payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!res?.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    console.error("Failed to fetch life goal transactions:", error?.message);
    return [];
  }
}