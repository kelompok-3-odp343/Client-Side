import axios from "axios";
import LIFE_GOALS_DUMMY from "../data/life-goals.dummy";
import LIFE_GOALS_DETAILS_DUMMY from "../data/life-goals-details.dummy";
import LIFE_GOALS_TX_DUMMY from "../data/life-goals-tx.dummy";
import LIFE_GOALS_REVAMP_DUMMY from "../data/life-goals.revamp.dummy";

export async function fetchLifeGoals(userId = "USER001") {
  try {
    const res = await axios.get(`/api/life-goals/${userId}`);
    if (res.data.status && res.data.data?.goals) return res.data.data;
    return LIFE_GOALS_DUMMY.data;
  } catch {
    return LIFE_GOALS_DUMMY.data;
  }
}

export async function fetchLifeGoalDetail(userId, goalId) {
  try {
    const res = await axios.get(`/api/life-goals/${userId}/detail/${goalId}`);
    if (res.data.status && res.data.data) return res.data.data;
    return LIFE_GOALS_DETAILS_DUMMY[userId].details[goalId];
  } catch {
    return LIFE_GOALS_DETAILS_DUMMY[userId].details[goalId];
  }
}

export async function fetchLifeGoalTransactions(userId, goalId) {
  try {
    const res = await axios.get(`/api/life-goals/${userId}/transactions?goal_id=${goalId}`);
    if (res.data.status && res.data.data) return res.data.data;
    return LIFE_GOALS_TX_DUMMY[goalId] || {};
  } catch {
    return LIFE_GOALS_TX_DUMMY[goalId] || {};
  }
}

export async function fetchLifeGoalsRevamp(userId = "USER001") {
  try {
    const res = await axios.get(`/api/life-goals-revamp/${userId}`);
    if (res.data.status) return res.data.data;
    return LIFE_GOALS_REVAMP_DUMMY;
  } catch {
    return LIFE_GOALS_REVAMP_DUMMY;
  }
}