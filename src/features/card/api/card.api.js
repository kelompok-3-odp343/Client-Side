import axios from "axios";
import { DUMMY_CARDS, DUMMY_TRANSACTIONS } from "../data/card.dummy";

export async function fetchAllCards() {
  try {
    const res = await axios.get("/api/cards");
    if (res.data?.data?.length) return res.data.data;
    return DUMMY_CARDS;
  } catch {
    return DUMMY_CARDS;
  }
}

export async function fetchCardTransactions(accountId) {
  try {
    const res = await axios.get(`/api/cards/${accountId}/transactions`);
    if (res.data?.data?.length) return res.data.data;
    return DUMMY_TRANSACTIONS[accountId] || [];
  } catch {
    return DUMMY_TRANSACTIONS[accountId] || [];
  }
}