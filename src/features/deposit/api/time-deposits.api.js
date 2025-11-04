import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getTimeDeposits = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const userId = sessionStorage.getItem("user_id");
        const customerId = sessionStorage.getItem("cif");
        console.log('s', customerId);

        if (!token || !userId || !customerId) {
            throw new Error("Missing token, User-Id, or Customer-Id in sessionStorage");
        }

        const response = await api.get(`/api/v1/detail-deposit`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Id": userId,
                "Customer-Id": customerId,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (response.data && response.data.status === true) {
            return response.data;
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.error("Gagal mengambil data Time Deposits:", error.message);
        throw error;
    }
};
