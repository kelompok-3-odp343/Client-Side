import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

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

const generateDummyTransactions = (month, year) => {
    const m = String(month).padStart(2, '0');
    const isOdd = month % 2 !== 0;
    
    const items = [
        {
            transactionId: `TRX-DEP-${year}${m}-01`,
            transactionDate: `${year}-${m}-01T08:00:00`,
            transactionType: "Interest",
            debit_credit: "C",
            partyName: "Monthly Interest",
            partyDetail: "Interest Credit",
            amount: isOdd ? 187500 : 190000, 
        }
    ];

    if (month === 11) {
        items.push({
            transactionId: `TRX-DEP-${year}${m}-00`,
            transactionDate: `${year}-${m}-10T09:00:00`,
            transactionType: "Placement",
            debit_credit: "D",
            partyName: "Initial Deposit",
            partyDetail: "Time Deposit Opening",
            amount: 50000000,
        });
    }

    return items;
};

export const getTimeDeposits = async () => {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) return { data: DUMMY_DEPOSITS };

        const response = await api.get(`/api/v1/detail-deposit`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (response.data?.status) return response.data;
        return { data: DUMMY_DEPOSITS };
    } catch (error) {
        return { data: DUMMY_DEPOSITS };
    }
};

export const getTimeDepositTransactions = async ({ month, year, accountNumber }) => {
    try {
        const token = sessionStorage.getItem("token");
        const payload = { month, year, accountNumber, productType: 'DEP' };

        if (token) {
            const response = await api.post(`/api/v1/trx-history`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (response.data?.transactions?.length) return response.data;
            if (response.data?.transaction?.length) return { transactions: response.data.transaction };
        }

        return { transactions: generateDummyTransactions(month, year) };
    } catch (error) {
        return { transactions: generateDummyTransactions(month, year) };
    }
};