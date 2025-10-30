import { DUMMY_CARDS } from "../data/dashboard.dummy.js";
import axios from "axios";
import { DASHBOARD_DUMMY } from "../data/dashboardPage.dummy.js";

const API_BASE_URL = import.meta.env.BASE_URL;

export async function fetchCards(userId, token) {
  try {
    if (!API_BASE_URL) throw new Error("API URL not found");

    const resp = await fetch(
      `${API_BASE_URL}/api/v1/cards?user_id=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resp.ok) throw new Error("API error");
    const json = await resp.json();
    if (!json?.data?.list) throw new Error("Invalid API response");

    return json.data.list;
  } catch (err) {
    console.warn("⚠️ Using dummy cards due to API error:", err.message);
    return DUMMY_CARDS;
  }
}

export async function fetchDashboard() {
  try {
    const token = sessionStorage.getItem('token');

    const data = await axios.get(`/api/v1/fetch-dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Id": sessionStorage.getItem('user_id'),
        "Customer-Id": sessionStorage.getItem('cif'),
        // "Customer-Id": "CIF001",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    })

    return data;
  } catch (error) {
    console.error('Error saat mengambil data dashboard', error);
    // REAL RESPONSE
    // return null;
    // Dummy Data
    return { data: DASHBOARD_DUMMY };
  }
}