import axios from "axios";
import LIFE_GOALS_DETAILS_DUMMY from "../data/life-goals-details.dummy"
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

const generateLifeGoalTransactions = (month, year, type = "General") => {
  const m = String(month).padStart(2, '0');
  return [
      {
          transactionId: `LG-${year}${m}-01`,
          date: `${year}-${m}-01`, 
          items: [
              {
                  type: "Auto Debit",
                  desc: "Monthly Auto Debit",
                  amount: "+500000",
              }
          ]
      },
      {
          transactionId: `LG-${year}${m}-15`,
          date: `${year}-${m}-15`,
          items: [
              {
                  type: "Profit Sharing",
                  desc: "Monthly Return",
                  amount: "+15000",
              }
          ]
      }
  ];
};

export async function fetchLifeGoals(userId = "USER001") {
  try {
    const res = await api.get(`/api/v1/life-goals/${userId}`);
    if (res?.data?.status && res.data.data?.goals) return res.data.data;
    return LIFE_GOALS_DUMMY.data;
  } catch (error) {
    return LIFE_GOALS_DUMMY.data;
  }
}

export async function fetchLifeGoalDetail(accountNumber) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.get(`/api/v1/lifegoals-detail`, {
      params: { accountNumber }, 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (res?.data) return res;
    const key = mapAccountToKey(accountNumber);
    return { data: LIFE_GOALS_DETAILS_DUMMY[key] };
  } catch (error) {
    const key = mapAccountToKey(accountNumber);
    return { data: LIFE_GOALS_DETAILS_DUMMY[key] };
  }
}

export async function fetchLifeGoalTransactions(accountNumber, month, year) {
  try {
    const token = sessionStorage.getItem("token");
    const res = await api.get(`/api/v1/lifegoals-tx/${accountNumber}`, {
      params: { month, year },
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (res?.data) return res.data;

    return generateLifeGoalTransactions(month, year);
    
  } catch (error) {
    return generateLifeGoalTransactions(month, year);
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
    return { data: LIFE_GOALS_REVAMP_DUMMY };
  } catch (error) {
    return { data: LIFE_GOALS_REVAMP_DUMMY };
  }
}