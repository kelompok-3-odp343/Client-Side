import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Dummy data untuk savings overview
const DUMMY_SAVINGS_OVERVIEW = {
    data: {
        targetAccountDetail: {
            Total_EffectiveBalance: 86000000
        },
        accountList: [
            {
                product_name: "TAPLUS BISNIS",
                account_number: "1234567890",
                account_name: "OKTAVIA QURROTA A'YUNI",
                effective_balance_total: 36000000,
                account_status: "Active"
            },
            {
                product_name: "TAPLUS MUDA",
                account_number: "9876543210",
                account_name: "OKTAVIA QURROTA A'YUNI",
                effective_balance_total: 30000000,
                account_status: "Active"
            },
            {
                product_name: "TAPLUS PELAJAR",
                account_number: "1122334455",
                account_name: "OKTAVIA QURROTA A'YUNI",
                effective_balance_total: 20000000,
                account_status: "Active"
            }
        ]
    }
};

// Dummy data untuk savings detail
const DUMMY_SAVINGS_DETAIL = {
    summary: {
        total_credit: 25000000,
        total_debit: 8500000,
        net_growth: 16500000
    },
    category_breakdown: [
        { category: "Food", total_amount: 3500000, percent: 41 },
        { category: "Shopping", total_amount: 3000000, percent: 35 },
        { category: "Others", total_amount: 2000000, percent: 24 }
    ]
};

export const getSavingsOverview = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.post(`/api/v1/savings`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        return response.data;
    } catch (error) {
        console.warn("⚠️ Savings overview API failed, using dummy:", error?.message);
        return DUMMY_SAVINGS_OVERVIEW;
    }
};

export const getSavingsDetail = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.post(`/api/v1/savings/detail`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });



        if (!response.data || !response.data.summary) {
            console.warn("⚠️ API returned invalid data, using dummy");
            return DUMMY_SAVINGS_DETAIL;
        }

        return response.data;
    } catch (error) {
        console.warn("⚠️ Savings detail API failed, using dummy:", error?.message);
        return DUMMY_SAVINGS_DETAIL;
    }
};

// ===============================
// NEW: getSavingsData (Dipakai Dashboard)
// ===============================
export const getSavingsData = async () => {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.get(`/api/v1/savings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        const resData = response?.data?.data;

        if (!resData || !resData.accountList) {
            console.warn("⚠️ API returned invalid data, using dummy");
            return transformSavingsData(DUMMY_SAVINGS_OVERVIEW.data);
        }

        return transformSavingsData(resData);
    } catch (error) {
        console.warn("⚠️ Savings data API failed, using dummy:", error?.message);
        return transformSavingsData(DUMMY_SAVINGS_OVERVIEW.data);
    }
};

// Helper transform data agar sesuai format yang dibutuhkan komponen
const transformSavingsData = (data) => {
    return [
        {
            total_balance: data.targetAccountDetail.Total_EffectiveBalance,
            items: data.accountList.map((acc) => ({
                account_name: acc.account_name,
                account_number: acc.account_number,
                effective_balance: acc.effective_balance_total,
            })),
        },
    ];
};
