import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getUserProfile = async () => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.get("/api/v1/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    
    if (!res.data?.status || !res.data?.data) {
      throw new Error("Invalid response from API");
    }
    
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error?.message);
    throw error;
  }
};