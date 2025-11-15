import axios from "axios";
import adminUsersDummy from "../dummy/adminUsers.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminUsers = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get("/api/admin/user/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { data: resp.data, error: false };
    } catch (err) {
        console.warn("Server OFF → Using dummy admin users list...");
        return {
            data: adminUsersDummy,
            error: true,
        };
    }
};
