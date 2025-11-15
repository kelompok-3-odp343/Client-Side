import axios from "axios";
import adminTransactionDummy from "../dummy/adminTransaction.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminTransactionList = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.post(
            "/api/admin/transaction/list",
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { data: resp.data, error: false };
    } catch (error) {
        console.warn("Server OFF / Error → Using dummy transaction history...");

        return {
            data: adminTransactionDummy,
            error: true,
        };
    }
};
