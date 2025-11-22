import axios from "axios";
import dummyActivityList from "../dummy/adminActivity.dummy";
import dummyActivityDetailList from "../dummy/adminActivityDetail.dummy";
import dummyApproverList from "../dummy/approverList.dummy";

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

export const postAdminApproval = async ({ activityId, approverData, isApprove }) => {
    try {
        const token = sessionStorage.getItem("token");

        const payload = {
            activityId,
            isApprove,
            approverData
        };

        const resp = await api.post("/api/admin/user/approval", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return { ok: true, data: resp.data };

    } catch (err) {
        console.error("Approval API Error:", err);

        return {
            ok: false,
            message:
                err?.response?.data?.message ||
                err?.message ||
                "Approval failed (DEV fallback).",
        };
    }
};

export const fetchApproverList = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const roleName = 'APPROVER';

        const resp = await api.post(
            "/api/admin/approver-list",
            { roleName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return { ok: true, data: resp.data.data };
    } catch (err) {
        console.error("Approver list error:", err);
        return { ok: true, data: dummyApproverList };
    }
};