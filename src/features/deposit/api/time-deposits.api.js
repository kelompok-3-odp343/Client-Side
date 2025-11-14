import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getTimeDeposits = async () => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Missing token in sessionStorage");
        }

        const response = await api.get(`/api/v1/detail-deposit`, {
            headers: {
                "Authorization": `Bearer ${token}`,
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
        console.error("❌ Gagal mengambil data Time Deposits:", error.message);
        throw error;
    }
};

export const getTimeDepositTransactions = async ({ month, year, accountNumber }) => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Missing token in sessionStorage");
        }

        const payload = {
            month,
            year,
            accountNumber,
        };

        const response = await api.post(`/api/v1/trx-history`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (response.data?.transactions?.length) {
            return response.data;
        }
        if (response.data?.transaction?.length) {
            return { transactions: response.data.transaction };
        }
        return { transactions: [] };
    } catch (error) {
        console.error("Gagal mengambil transaksi deposito:", error.message);
        return { transactions: [] };
    }
};
