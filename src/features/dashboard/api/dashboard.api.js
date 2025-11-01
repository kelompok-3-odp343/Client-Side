import axios from "axios";
import { DASHBOARD_DUMMY } from "../data/dashboard.dummy.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchDashboard() {
  try {
    const token = sessionStorage.getItem("token");

    const resp = await api.get(`/api/v1/fetch-dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Id": sessionStorage.getItem("user_id"),
        "Customer-Id": sessionStorage.getItem("cif"),
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    return resp;
  } catch (error) {
    console.warn("⚠️ Gagal memuat API dashboard, fallback ke dummy:", error.message);
    return { data: DASHBOARD_DUMMY };
  }
}