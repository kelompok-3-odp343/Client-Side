import axios from "axios";
import adminUsersDummy from "../dummy/adminUsers.dummy";
import adminUsersMenuAccess from "../dummy/adminUsersMenuAccess.dummy";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchAdminUsers = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get("/api/admin/users-list", {
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

export const fetchMenuAccess = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const resp = await api.get("/api/admin/menu-access", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { data: resp.data, error: false };
    } catch (error) {
        console.warn("Server OFF → Using dummy menu access...");
        return {
            data: adminUsersMenuAccess,
            error: true,
        };
    }
};

export const fetchAdminBlock = async ({ userData, reason, checkerData, menuData, approverData }) => {
    try {
        const token = sessionStorage.getItem("token");

        const payload = {
            userData,
            reason,
            checkerData,
            menuData,
            approverData
        };

        const resp = await api.post("/api/admin/user/block", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        return { ok: true, data: resp.data };

    } catch (error) {
        console.error('Error admin Block', error);
        return { ok: false, error };
    }
};

export const fetchAdminUnBlock = async ({ userData, reason, checkerData, menuData, approverData }) => {
    try {
        const token = sessionStorage.getItem("token");

        const payload = {
            userData,
            reason,
            checkerData,
            menuData,
            approverData
        };

        const resp = await api.post("/api/admin/user/unblock", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        return { ok: true, data: resp.data };

    } catch (error) {
        console.error('Error admin Unblock', error);
        return { ok: false, error };
    }
};

export async function fetchApproverList(roleName = "CHECKER") {
    try {
        const response = await api.post(
            "/api/admin/approver-list",
            { roleName },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data?.data || [];
    } catch (err) {
        console.error("Error fetchApproverList:", err);
        return [];
    }
}