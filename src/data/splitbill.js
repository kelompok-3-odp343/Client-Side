// Simulasi endpoint untuk transaksi dan split bill

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ambil detail transaksi berdasarkan ID
 */
export async function fetchTransactionDetails(id) {
  await delay(200);
  return {
    id,
    date: "31 May 2025",
    detail: "Dinner with Friends",
    amount: "Rp 120.000",
  };
}

/**
 * Simulasi penyimpanan split bill
 */
export async function saveSplitBill(payload) {
  await delay(300);
  console.log("Split bill saved:", payload);
  return { success: true };
}