// Simulated Pension Funds API
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulate: /api/funds/{user_id}/pensions
 */
export async function fetchPensionFunds(userId) {
  await delay(400);

  return {
    status: true,
    message: "Pension funds fetched successfully",
    data: {
      user_id: userId,
      total_balance: 5000000,
      total_accounts: 2,
      items: [
        {
          id: "PEN001",
          title: "Simponi Likuid",
          account_number: "1234567890",
          balance: 323000,
          growth: "-0.7%",
        },
        {
          id: "PEN002",
          title: "Simponi Likuid Syariah",
          account_number: "1234567891",
          balance: 323000,
          growth: "+0.7%",
        },
      ],
    },
  };
}

/**
 * Simulate: /api/funds/{user_id}/pensions/{month}/transactions
 */
export async function fetchPensionTransactions(userId, month) {
  await delay(350);

  const all = [
    {
      id: "TRX001",
      date: "31 May 2025",
      month: "May",
      type: "Simponi Likuid",
      detail: "Admin fee",
      amount: "-Rp1.000",
    },
    {
      id: "TRX002",
      date: "31 May 2025",
      month: "May",
      type: "Simponi Likuid Syariah",
      detail: "Management fee",
      amount: "-Rp7",
    },
    {
      id: "TRX003",
      date: "30 May 2025",
      month: "May",
      type: "Simponi Likuid Syariah",
      detail: "Pension Fund Contribution",
      amount: "-Rp3.500",
    },
    {
      id: "TRX004",
      date: "01 June 2025",
      month: "June",
      type: "Simponi Likuid",
      detail: "Contribution",
      amount: "+Rp1.000.000",
    },
  ];

  const filtered = all.filter((t) => t.month === month);

  return {
    status: "success",
    message: `Transaction history fetched for ${month}`,
    data: filtered,
  };
}