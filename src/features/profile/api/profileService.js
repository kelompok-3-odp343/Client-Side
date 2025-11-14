import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getUserProfile = async () => {
  try {
    const token = sessionStorage.getItem('token');

    const res = await api.get("/api/v1/profile",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    if (res.data?.status && res.data?.data) {
      return res.data.data;
    } throw new Error("Invalid API response");
  } catch (error) {
    console.error("Gagal mengambil data Time Deposits:", error);
    throw error;
  }
};