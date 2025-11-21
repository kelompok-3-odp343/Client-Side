import axios from "axios";
import LIFE_GOALS_DETAILS_DUMMY from "../data/life-goals-details.dummy"
import LIFE_GOALS_TX_DUMMY from "../data/life-goals-tx.dummy";
import LIFE_GOALS_REVAMP_DUMMY from "../data/life-goals.revamp.dummy";
import LIFE_GOALS_DUMMY from "../data/life-goals.dummy";

const mapAccountToKey = (accountNumber) => {
  if (!accountNumber) return "education";
  const num = String(accountNumber).toLowerCase();

  if (num.includes("edu")) return "education";
  if (num.includes("vac")) return "vacations";
  if (num.includes("mar")) return "marriage";
  if (num.includes("hom")) return "home";
  if (num.includes("gad")) return "gadget";
  if (num.includes("veh")) return "vehicles";

  return "education";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function fetchLifeGoals(userId = "USER001") {
  try {
    const res = await api.get(`/api/v1/life-goals/${userId}`);
    if (res?.data?.status && res.data.data?.goals) return res.data.data;

    console.warn("⚠️ API returned invalid data, using dummy");
    return LIFE_GOALS_DUMMY.data;
  } catch (error) {
    console.warn("⚠️ Life goals API failed, using dummy:", error?.message);
    return LIFE_GOALS_DUMMY.data;
  }
}

export async function fetchLifeGoalDetail(accountNumber) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.get(`/api/v1/lifegoals-detail`, {
      accountNumber
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (res?.data) return res;

    console.warn("⚠️ API returned invalid data, using dummy");
    const key = mapAccountToKey(accountNumber);
    return { data: LIFE_GOALS_DETAILS_DUMMY[key] };
  } catch (error) {
    console.warn("⚠️ Life goal detail API failed, using dummy:", error?.message);
    const key = mapAccountToKey(accountNumber);
    return { data: LIFE_GOALS_DETAILS_DUMMY[key] };
  }
}

export async function fetchLifeGoalTransactions(accountNumber) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.get(`/api/v1/lifegoals-tx/${accountNumber}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (res?.data) return res.data;

    console.warn("⚠️ API returned invalid data, using dummy");
    const key = mapAccountToKey(accountNumber);
    return LIFE_GOALS_TX_DUMMY[key] || LIFE_GOALS_TX_DUMMY.EDU001;
  } catch (error) {
    console.warn("⚠️ Life goal transactions API failed, using dummy:", error?.message);
    const key = mapAccountToKey(accountNumber);
    return LIFE_GOALS_TX_DUMMY[key] || LIFE_GOALS_TX_DUMMY.EDU001;
  }
}

export async function fetchLifeGoalsRevamp() {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.get(`/api/v1/lifegoals`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (res?.data) return res;

    console.warn("⚠️ API returned invalid data, using dummy");
    return { data: LIFE_GOALS_REVAMP_DUMMY };
  } catch (error) {
    console.warn("⚠️ Life goals revamp API failed, using dummy:", error?.message);
    return { data: LIFE_GOALS_REVAMP_DUMMY };
  }
}