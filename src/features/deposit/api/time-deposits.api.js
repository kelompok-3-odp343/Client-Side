import axios from "axios";

export const getTimeDeposits = async (userId) => {
    try {
        const response = await axios.get(`/api/time-deposits/${userId}`);

        // Pastikan response valid
        if (response.data && response.data.status === true) {
            console.log("data dari api");
            return response.data;
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.warn("Coba data jadi dummy dulu", error.message);
        const dummyResponse = {
            status: true,
            message: "Time deposits fetched successfully (dummy)",
            data: {
                fund_id: `AGG_TIMEDEPOSITS_${userId}`,
                title: "Time Deposits",
                total_balance: 5100000,
                count_accounts: 2,
                items: [{
                        item_id: "TDA001",
                        deposit_account_number: "TD123456",
                        balance: 1000000,
                        tenor_months: 3,
                        maturity_date: "2025-11-28T00:00:00Z",
                        interest_rate: 0.4,
                        status: "ACTIVE",
                    },
                    {
                        item_id: "TDA002",
                        deposit_account_number: "TD987654",
                        balance: 31000000,
                        tenor_months: 6,
                        maturity_date: "2026-01-10T00:00:00Z",
                        interest_rate: 0.5,
                        status: "ACTIVE",
                    },
                ],
            },
        };
        await new Promise((resolve) => setTimeout(resolve, 800));

        return dummyResponse;
    }
};