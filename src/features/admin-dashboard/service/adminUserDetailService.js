import axios from "axios";
import dummyUserDetail from "../dummy/adminUserDetail.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminUserDetail = async (userId) => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.post(
            "/api/admin/user/detail",
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { data: resp.data, error: false };
    } catch (err) {
        console.warn("Server OFF → Using dummy user detail...");
        return { data: dummyUserDetail(userId), error: true };
    }
};
