import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getSavingsOverview = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.get(`/api/v1/savings`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        if (!response.data || !response.data.data) {
            throw new Error("Data tidak ditemukan");
        }

        return response.data;
    } catch (error) {
        console.error("Error getSavingsOverview:", error);
        throw error;
    }
};

export const getSavingsDetail = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.get(`/api/v1/savings/detail`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        if (!response.data || !response.data.summary) {
            throw new Error("Data tidak ditemukan");
        }

        return response.data;
    } catch (error) {
        console.error("Error getSavingsDetail:", error);

        throw error;
    }
};
