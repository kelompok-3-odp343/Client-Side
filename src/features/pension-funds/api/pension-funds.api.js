import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getPensionFunds = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const resp = await api.get(`/api/v1/dplk`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!resp.data?.data) {
            throw new Error("Invalid response from API");
        }

        return resp.data;
    } catch (error) {
        console.error("Failed to fetch pension funds:", error?.message);
        throw error;
    }
};

export async function fetchDPLKTransactionHistory({ month, year, accountNumber }) {
    try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const payload = { month, year, accountNumber, productType: 'DPLK' };

        const resp = await api.post("/api/v1/trx-history", payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        if (resp.data?.transaction?.length) {
            return resp.data;
        }
        
        if (resp.data?.transactions?.length) {
            return resp.data;
        }

        return { transactions: [] };
    } catch (error) {
        console.error("Failed to fetch DPLK transactions:", error?.message);
        return { transactions: [] };
    }
}