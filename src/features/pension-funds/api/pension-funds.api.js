import axios from 'axios'

export const getPensionFunds = async (userId) => {
    try {
        const response = await axios.get(`/api/pension-funds/${userId}`);

        if (response.data && response.data.status === true) {
            console.log("get pension funds");
            return response.data;
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.warn("Dummy data dulu", error.message);

        const dummyResponse = {
            status: true,
            message: "Pension fund fetched successfully (dummy)",
            data: [{
                    fund_id: "DPLK_0001",
                    title: "Pension Funds - DPLK12345",
                    total_balance: 50000000,
                    items: [{
                        item_id: "DPLK_0001",
                        deposit_account_number: "DPLK12345",
                        balance: 50000000,
                        maturity_date: "2026-06-01T00:00:00Z",
                        currency_code: "IDR",
                    }, ],
                },
                {
                    fund_id: "DPLK_0002",
                    title: "Pension Funds - DPLK67890",
                    total_balance: 8000000,
                    items: [{
                        item_id: "DPLK_0002",
                        deposit_account_number: "DPLK67890",
                        balance: 8000000,
                        maturity_date: "2026-12-15T00:00:00Z",
                        currency_code: "IDR",
                    }, ],
                },
            ],
        };

        await new Promise((resolve) => setTimeout(resolve, 800));

        return dummyResponse;
    }
};