import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Dummy data untuk pension funds
const DUMMY_PENSION_FUNDS = {
    data: [
        {
            title: "DPLK BNI",
            totalBalance: 68000000,
            items: [
                {
                    fundId: "DPLK001",
                    depositAccountNumber: "4001234567",
                    accumulatedBalance: 35000000,
                    growth: 0.08
                },
                {
                    fundId: "DPLK002",
                    depositAccountNumber: "4001234568",
                    accumulatedBalance: 33000000,
                    growth: 0.06
                }
            ]
        }
    ]
};

// Dummy transaction history
const DUMMY_DPLK_TRX = {
    transactions: [
        {
            transactionId: "TRX-DPLK-001",
            transactionDate: "2025-11-01T08:00:00",
            transactionType: "Contribution",
            debit_credit: "C",
            description: "Monthly Contribution",
            partyName: "Employee Contribution",
            amount: 1000000,
        },
        {
            transactionId: "TRX-DPLK-002",
            transactionDate: "2025-11-01T08:00:00",
            transactionType: "Investment Return",
            debit_credit: "C",
            description: "Investment Yield",
            partyName: "Fund Management",
            amount: 150000,
        }
    ]
};

export const getPensionFunds = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const resp = await api.get(`/api/v1/dplk`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (resp.data?.data) {
            return resp.data;
        }

        console.warn("⚠️ API returned invalid data, using dummy");
        return DUMMY_PENSION_FUNDS;

    } catch (error) {
        console.warn("⚠️ Pension funds API failed, using dummy:", error?.message);
        return DUMMY_PENSION_FUNDS;
    }
};

export async function fetchDPLKTransactionHistory({ month, year, accountNumber }) {
    try {
        const token = sessionStorage.getItem("token");
        const payload = { month, year, accountNumber };

        const resp = await api.post("/api/v1/trx-history", payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        if (resp.data?.transaction?.length) return resp.data;
        if (resp.data?.transactions?.length) return resp.data;

        console.warn("⚠️ No transaction data, using dummy");
        return DUMMY_DPLK_TRX;

    } catch (error) {
        console.warn("⚠️ DPLK transaction API failed, using dummy:", error?.message);
        return DUMMY_DPLK_TRX;
    }
}