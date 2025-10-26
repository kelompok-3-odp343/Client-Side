// src/features/life-goals/api/life-goals.api.js
import axios from "axios";
import LIFE_GOALS_DUMMY from "../data/life-goals.dummy";
import LIFE_GOALS_DETAILS_DUMMY from "../data/life-goals-details.dummy";
import LIFE_GOALS_TX_DUMMY from "../data/life-goals-tx.dummy";
import LIFE_GOALS_REVAMP_DUMMY from "../data/life-goals.revamp.dummy";

export async function fetchLifeGoals(userId = "USER001") {
  try {
    const res = await axios.get(`/api/life-goals/${userId}`);
    if (res?.data?.status && res.data.data?.goals) return res.data.data;
    return LIFE_GOALS_DUMMY.data;
  } catch (err) {
    return LIFE_GOALS_DUMMY.data;
  }
}

export async function fetchLifeGoalDetail(userId = "USER001", goalId) {
  // goalId optional for dummy lookup
  try {
    const res = await axios.get(`/api/life-goals/${userId}/detail/${goalId}`);
    if (res?.data?.status && res.data.data) return res.data.data;
    // fallback: try dummy shape
    const fallback = (LIFE_GOALS_DETAILS_DUMMY[userId] && LIFE_GOALS_DETAILS_DUMMY[userId].details) || {};
    return fallback[goalId] || null;
  } catch (err) {
    const fallback = (LIFE_GOALS_DETAILS_DUMMY[userId] && LIFE_GOALS_DETAILS_DUMMY[userId].details) || {};
    return fallback[goalId] || null;
  }
}

export async function fetchLifeGoalTransactions(userId = "USER001", goalId) {
  try {
    const res = await axios.get(`/api/life-goals/${userId}/transactions?goal_id=${goalId}`);
    if (res?.data?.status && res.data.data) return res.data.data;
    return LIFE_GOALS_TX_DUMMY[goalId] || {};
  } catch (err) {
    return LIFE_GOALS_TX_DUMMY[goalId] || {};
  }
}

export async function fetchLifeGoalsRevamp() {
  try {
    const token = sessionStorage.getItem('token');

    const res = await axios.get(`/api/v1/lifegoals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Id": sessionStorage.getItem('user_id'),
        "Customer-Id": sessionStorage.getItem('cif'),
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    });
    return res;
  } catch (err) {
    // return null;
    return { data: LIFE_GOALS_REVAMP_DUMMY }
  }
}