import axios from "axios";
import dummyActivityList from "../dummy/adminActivity.dummy";
import dummyActivityDetailList from "../dummy/adminActivityDetail.dummy";

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

export const fetchAdminActivityDetail = async (activityId) => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.post(
            "/api/admin/activity/detail",
            { activityId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return resp.data;

    } catch (err) {
        console.warn("Server OFF → Using dummy DETAIL");

        const dummy = dummyActivityDetailList.find(
            (a) => a.activityId === activityId
        );

        if (!dummy) {
            console.warn("Detail not found, generating fallback...");
            return {
                activityId,
                activityData: { userId: "P000", customerId: "CIF0000", customerName: "Unknown User" },
                checkerData: {},
                approverData: {},
                status: "PENDING_CHECKER",
                reason: "No detail available",
                menu: "USER_MANAGEMENT",
                menu_action: "BLOCK_USER",
                created_time: new Date().toISOString().replace("Z", "TZ"),
                checker_updated_time: "",
                maker_updated_time: "",
                approver_updated_time: ""
            };
        }

        return dummy;
    }
};
