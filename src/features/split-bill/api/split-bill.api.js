import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function normalizeBill(b) {
  if (!b) return null;

  const bill = {
    split_bill_id: b.split_bill_id || b.splitBillId || b.id || null,
    split_bill_title:
      b.split_bill_title ||
      b.splitBillTitle ||
      b.title ||
      "Untitled Bill",
    total_bill:
      Number(b.total_bill || b.totalBill || b.totalAmount || 0) || 0,
    ref_id: b.ref_id || b.refId || b.transactionId || null,
    created_time: b.created_time || b.createdTime || b.created_at || new Date().toISOString(),
    members: (b.members || b.billMembers || b.splitBillMemberDetail || []).map((m) => {
      const amountRaw = m.amount ?? m.amountShare ?? m.totalBillAmount ?? 0;
      const amount = typeof amountRaw === "string"
        ? Number(amountRaw.replace(/[^\d.-]/g, "")) || 0
        : Number(amountRaw || 0);

      const status = (m.status || (m.hasPaid ? (m.hasPaid ? "Paid" : "Unpaid") : m.paymentStatus) || "Unpaid");
      return {
        member_id: m.member_id || m.memberId || m.id || null,
        member_name: m.member_name || m.memberName || m.participantName || "Unknown",
        amount,
        status,
        hasPaid: m.hasPaid === undefined ? (status === "Paid") : Boolean(m.hasPaid),
      };
    }),
  };

  bill.remaining_bill = bill.members
    .filter((m) => m.status !== "Paid")
    .reduce((s, m) => s + (Number(m.amount) || 0), 0);

  return bill;
}

export async function fetchSplitBills() {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.get("/api/v1/split-bill", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    if (!Array.isArray(res?.data?.data)) {
      return {
        status: true,
        data: []
      };
    }

    return {
      status: true,
      data: res.data.data.map(normalizeBill),
    };
  } catch (error) {
    console.error("Failed to fetch split bills:", error?.message);
    return {
      status: false,
      data: []
    };
  }
}

export async function getSplitBillById(splitBillId) {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post(
      "/api/v1/split-bill/detail",
      { splitBillId },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        timeout: 5000,
      }
    );

    const data = res?.data?.data;
    if (!data) {
      throw new Error("No data returned from API");
    }

    return normalizeBill(data);
  } catch (error) {
    console.error("Failed to fetch split bill detail:", error?.message);
    throw error;
  }
}

export async function updateSplitBillStatus(split_bill_id, updatedMembers) {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const payload = {
      splitBillId: split_bill_id,
      members: updatedMembers.map((m) => ({
        memberId: m.member_id,
        memberName: m.member_name,
        amount: Number(m.amount) || 0,
        hasPaid: m.status === "Paid" || m.hasPaid === true,
        status: m.status,
      })),
    };

    const res = await api.post("/api/v1/split-bill/update", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    if (res.status >= 200 && res.status < 300) {
      return normalizeBill(res.data?.data || res.data);
    }

    throw new Error("Failed to update split bill status");
  } catch (error) {
    console.error("Failed to update split bill status:", error?.message);
    throw error;
  }
}

export async function createSplitBill(payload) {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const newBill = {
      accountNumber: payload.accountNumber,
      transactionId: payload.transactionId,
      splitBillTitle: payload.splitBillTitle,
      currency: payload.currency || "IDR",
      totalAmount: payload.totalAmount,
      billMembers: payload.billMembers,
    };

    const res = await api.post("/api/v1/split-bill/add", newBill, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    if (res.status >= 200 && res.status < 300) {
      return normalizeBill(res.data?.data || res.data);
    }

    throw new Error("Failed to create split bill");
  } catch (error) {
    console.error("Failed to create split bill:", error?.message);
    throw error;
  }
}

export async function editSplitBill(split_bill_id, bill, members) {
  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const payload = {
      splitBillId: split_bill_id,
      transactionId: bill.ref_id,
      splitBillTitle: bill.split_bill_title,
      totalAmount: Number(bill.total_bill),
      billMembers: members.map((m) => ({
        memberId: m.member_id,
        memberName: m.member_name,
        amountShare: Number(m.amount) || 0,
        hasPaid: m.status === "Paid" || m.hasPaid === true,
      })),
    };

    const res = await api.post("/api/v1/split-bill/edit", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    return normalizeBill(res.data?.data || res.data);
  } catch (error) {
    console.error("Failed to edit split bill:", error?.message);
    throw error;
  }
}