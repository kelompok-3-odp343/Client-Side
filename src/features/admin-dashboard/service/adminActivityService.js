import axios from "axios";
import dummyActivityList from "../dummy/adminActivity.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminActivityList = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get("/api/admin/activity/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            data: { activityList: resp.data.activityList },
            error: false,
        };

    } catch (err) {
        console.warn("Server OFF → Using dummy 100 activities...");
        return {
            data: { activityList: dummyActivityList },
            error: true,
        };
    }
};
