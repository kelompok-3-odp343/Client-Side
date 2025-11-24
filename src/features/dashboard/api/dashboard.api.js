import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchDashboard() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp = await api.get(`/api/v1/fetch-dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!resp?.data) {
      return { data: {} };
    }

    return resp;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error?.message);
    throw error;
  }
}