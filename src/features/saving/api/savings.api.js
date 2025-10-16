import axios from "axios";

export const getSavingsData = async (userId) => {
    try {
        const response = await axios.get(`/api/savings/${userId}`);

        if (response.data && response.data.status === true) {
            console.log("dari api");
            return response.data;
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.warn("pakai dummy dulu", error.message);

        const dummyResponse = {
            status: true,
            message: "Dummy data sementara",
            data: [{
                    account_id: "ACCT_9876543210",
                    title: "Savings - TAPLUS PEGAWAI BNI",
                    total_balance: 500000000,
                    items: [{
                        item_id: "ACCT_9876543210",
                        account_number: "1234567899",
                        account_name: "TAPLUS PEGAWAI BNI",
                        effective_balance: 500000000,
                        is_main_account: false,
                        account_status: "BUKA",
                    }, ],
                },
                {
                    account_id: "ACCT_12345678910",
                    title: "Savings - TAPLUS BISNIS",
                    total_balance: 12000000000,
                    items: [{
                        item_id: "ACCT_12345678910",
                        account_number: "12345678910",
                        account_name: "TAPLUS BISNIS",
                        effective_balance: 12000000000,
                        is_main_account: true,
                        account_status: "BUKA",
                    }, ],
                },
            ],
        };

        await new Promise((resolve) => setTimeout(resolve, 800));

        return dummyResponse;
    }
};