import axios from "axios";
import { DASHBOARD_DUMMY } from "../data/dashboard.dummy.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchDashboard() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ No token found, using dummy dashboard");
      return { data: DASHBOARD_DUMMY };
    }

    const resp = await api.get(`/api/v1/fetch-dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (resp?.data) {
      return resp;
    }

    console.warn("⚠️ API returned invalid data, using dummy dashboard");
    return { data: DASHBOARD_DUMMY };
  } catch (error) {
    console.warn("⚠️ Dashboard API failed, using dummy:", error?.message);
    return { data: DASHBOARD_DUMMY };
  }
}