import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getSavingsOverview = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await api.post(`/api/v1/savings`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.data) {
            throw new Error("Invalid response from API");
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch savings overview:", error?.message);
        throw error;
    }
};

export const getSavingsDetail = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await api.post(`/api/v1/savings/detail`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.data || !response.data.summary) {
            throw new Error("Invalid response from API");
        }

        return response.data;
    } catch (error) {
        console.error("Failed to fetch savings detail:", error?.message);
        throw error;
    }
};

export const getSavingsData = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await api.get(`/api/v1/savings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        const resData = response?.data?.data;

        if (!resData || !resData.accountList) {
            throw new Error("Invalid response from API");
        }

        return transformSavingsData(resData);
    } catch (error) {
        console.error("Failed to fetch savings data:", error?.message);
        throw error;
    }
};

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