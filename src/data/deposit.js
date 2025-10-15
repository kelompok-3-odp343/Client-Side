// Simulasi API Time Deposits

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Mengambil data ringkasan dan daftar deposito user.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function fetchDeposits(userId) {
  await delay(400);
  return {
    meta: { user_id: userId }, // <- gunakan userId agar tidak jadi unused
    totalBalance: 5000000,
    totalCount: 2,
    deposits: [
      {
        id: 1,
        title: "Short Term",
        balance: 2000000,
        interest: "0.4%",
        opening: "28 October 2025",
        period: "3 months",
        date: "28 Nov 2025",
      },
      {
        id: 2,
        title: "Long Term",
        balance: 3000000,
        interest: "0.4%",
        opening: "28 October 2025",
        period: "3 months",
        date: "28 Nov 2025",
      },
    ],
  };
}

/**
 * Mengambil transaksi deposito per bulan.
 * @param {string} userId
 * @param {string} month
 * @returns {Promise<Array>}
 */
export async function fetchDepositTransactions(userId, month) {
  await delay(300);
  const allTransactions = [
    { date: "31 May 2025", month: "May", type: "Long Term", detail: "Admin fee", amount: "-Rp1.000" },
    { date: "31 May 2025", month: "May", type: "Short Term", detail: "Management fee", amount: "-Rp7" },
    { date: "30 May 2025", month: "May", type: "Short Term", detail: "Deposits", amount: "-Rp3.500" },
  ];

  // sertakan userId di metadata pada setiap transaksi (tidak wajib, tapi memastikan userId "dipakai")
  return allTransactions
    .filter((t) => t.month === month)
    .map((t) => ({ ...t, fetched_for: userId }));
}