import axios from "axios";
import SPLIT_BILL_DUMMY_DATA from "../data/split-bill.dummy";

let DUMMY_STORAGE = [...SPLIT_BILL_DUMMY_DATA];

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
      b.splitBillTitle ||
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

    const res = await api.get("/api/v1/split-bill", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    if (Array.isArray(res?.data?.data)) {
      const bills = res.data.data;
      
      if (bills.length === 0) {
        return {
          status: true,
          data: DUMMY_STORAGE.map(normalizeBill),
        };
      }

      return {
        status: true,
        data: bills.map(normalizeBill),
      };
    }

    return { status: true, data: DUMMY_STORAGE.map(normalizeBill) };

  } catch (error) {
    return {
      status: true,
      data: DUMMY_STORAGE.map(normalizeBill)
    };
  }
}

export async function getSplitBillById(splitBillId) {
  try {
    const token = sessionStorage.getItem("token");

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
        throw new Error("Data empty");
    }

    return normalizeBill(data);
  } catch (error) {
    const dummyBill = DUMMY_STORAGE.find((b) => 
        String(b.split_bill_id) === String(splitBillId) || 
        String(b.splitBillId) === String(splitBillId)
    );
    return dummyBill ? normalizeBill(dummyBill) : null;
  }
}

export async function updateSplitBillStatus(split_bill_id, updatedMembers) {
  let successApi = false;
  let apiData = null;

  try {
    const token = sessionStorage.getItem("token");
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
      successApi = true;
      apiData = normalizeBill(res.data?.data || res.data);
    }
  } catch (err) {
    // Silent catch
  }

  const idx = DUMMY_STORAGE.findIndex((b) => 
    String(b.split_bill_id) === String(split_bill_id) || 
    String(b.splitBillId) === String(split_bill_id)
  );

  if (idx !== -1) {
    DUMMY_STORAGE[idx].members = updatedMembers.map((m) => ({
      member_id: m.member_id,
      member_name: m.member_name,
      amount: Number(m.amount) || 0,
      status: m.status || (m.hasPaid ? "Paid" : "Unpaid"),
      hasPaid: m.status === "Paid" || m.hasPaid === true,
    }));

    DUMMY_STORAGE[idx].remaining_bill = DUMMY_STORAGE[idx].members
      .filter((m) => m.status !== "Paid")
      .reduce((s, m) => s + (Number(m.amount) || 0), 0);
      
    if (!successApi) {
        return normalizeBill(DUMMY_STORAGE[idx]);
    }
  }

  return apiData;
}

export async function createSplitBill(payload) {
  const newBill = {
    accountNumber: payload.accountNumber,
    transactionId: payload.transactionId,
    splitBillTitle: payload.splitBillTitle,
    currency: payload.currency || "IDR",
    totalAmount: payload.totalAmount,
    billMembers: payload.billMembers,
  };

  let successApi = false;
  let apiData = null;

  try {
    const token = sessionStorage.getItem("token");

    const res = await api.post("/api/v1/split-bill/add", newBill, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 5000,
    });

    if (res.status >= 200 && res.status < 300) {
      successApi = true;
      apiData = normalizeBill(res.data?.data || res.data);
    }
  } catch (err) {
    // Silent catch
  }

  const _dummyNew = {
    split_bill_id: "SB" + String(Date.now()).slice(-6),
    split_bill_title: newBill.splitBillTitle,
    total_bill: newBill.totalAmount,
    created_time: new Date().toISOString(),
    ref_id: newBill.transactionId,
    members: (newBill.billMembers || []).map((m) => ({
      member_id: null,
      member_name: m.memberName,
      amount: m.amountShare ?? m.amount ?? 0,
      status: "Unpaid",
      hasPaid: false,
    })),
  };

  DUMMY_STORAGE.unshift(_dummyNew);

  return successApi ? apiData : normalizeBill(_dummyNew);
}