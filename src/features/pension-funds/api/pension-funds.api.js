import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getPensionFunds = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get(`/api/v1/dplk`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Id": sessionStorage.getItem("user_id"),
                "Customer-Id": sessionStorage.getItem("cif"),
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (resp.data?.data) {
            return resp.data;
        }

        return { data: [] };

    } catch (error) {
        console.error("PensionFunds API error", error?.message);
        return { data: [] };
    }
};


export async function fetchDPLKTransactionHistory({ month, year, accountNumber }) {
    try {
        const token = sessionStorage.getItem("token");

        const payload = {
            month,
            year,
            accountNumber
        };

        const resp = await api.post("/api/v1/trx-history", payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Id": sessionStorage.getItem("user_id"),
                "Customer-Id": sessionStorage.getItem("cif"),
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        if (resp.data?.transaction?.length) return resp.data;
        if (resp.data?.transactions?.length) return resp.data;

        return { transactions: [] };

    } catch (error) {
        console.error("DPLK trx error:", error?.message);
        return { transactions: [] };
    }
}
