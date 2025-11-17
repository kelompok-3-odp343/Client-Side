import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Dummy data untuk deposit
const DUMMY_DEPOSITS = {
    total_balance: 125000000,
    count_accounts: 3,
    items: [
        {
            item_id: "DEP001",
            deposit_account_number: "3001234567",
            balance: 50000000,
            interest_rate: 4.5,
            maturity_date: "2026-12-31T00:00:00.000Z",
            tenor_months: 12,
            status: "Active"
        },
        {
            item_id: "DEP002",
            deposit_account_number: "3001234568",
            balance: 40000000,
            interest_rate: 5.0,
            maturity_date: "2027-06-30T00:00:00.000Z",
            tenor_months: 18,
            status: "Active"
        },
        {
            item_id: "DEP003",
            deposit_account_number: "3001234569",
            balance: 35000000,
            interest_rate: 4.75,
            maturity_date: "2026-09-30T00:00:00.000Z",
            tenor_months: 9,
            status: "Active"
        }
    ]
};

// Dummy transaction history
const DUMMY_DEPOSIT_TRX = {
    transactions: [
        {
            transactionId: "TRX-DEP-001",
            transactionDate: "2025-11-01T08:00:00",
            transactionType: "Placement",
            debit_credit: "D",
            partyName: "Initial Deposit",
            partyDetail: "Time Deposit Opening",
            amount: 50000000,
        },
        {
            transactionId: "TRX-DEP-002",
            transactionDate: "2025-11-10T09:00:00",
            transactionType: "Interest",
            debit_credit: "C",
            partyName: "Monthly Interest",
            partyDetail: "Interest Credit",
            amount: 187500,
        }
    ]
};

export const getTimeDeposits = async () => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.warn("⚠️ No token found, using dummy data");
            return { data: DUMMY_DEPOSITS };
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
            console.warn("⚠️ API returned invalid data, using dummy");
            return { data: DUMMY_DEPOSITS };
        }
    } catch (error) {
        console.warn("⚠️ API unavailable, using dummy data:", error.message);
        return { data: DUMMY_DEPOSITS };
    }
};

export const getTimeDepositTransactions = async ({ month, year, accountNumber }) => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.warn("⚠️ No token found, using dummy transactions");
            return { transactions: DUMMY_DEPOSIT_TRX.transactions };
        }

        const payload = {
            month,
            year,
            accountNumber,
            productType: 'DEP'
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

        console.warn("⚠️ No transactions from API, using dummy");
        return { transactions: DUMMY_DEPOSIT_TRX.transactions };
    } catch (error) {
        console.warn("⚠️ Transaction API failed, using dummy:", error.message);
        return { transactions: DUMMY_DEPOSIT_TRX.transactions };
    }
};