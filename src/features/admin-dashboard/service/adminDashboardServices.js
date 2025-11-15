import axios from "axios";
import adminDummyDashboard from "../dummy/adminDashboard.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminDashboard = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get("/api/admin/transaction/summary", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { data: resp.data, error: false };
    } catch (error) {
        console.warn("Server OFF / Error → Using dummy data...");

        return {
            data: adminDummyDashboard,
            error: true,
        };
    }
};
