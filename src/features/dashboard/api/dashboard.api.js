import { DUMMY_CARDS } from "../data/dashboard.dummy.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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