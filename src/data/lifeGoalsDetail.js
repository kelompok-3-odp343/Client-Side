const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchLifeGoalDetail(userId, goalId) {
  await delay(300);

  const base = {
    account_number: "1234567890",
    estimated_funds: 50000000,
    initial_deposit: 100000,
    annual_interest: "3%",
    duration: "5 years",
    created_at: "25 May 2023",
    disbursement_date: "25 May 2028",
    disbursement_account: "1234567890",
    current_savings: 50000000,
    target: 100000000,
  };

  const transactions = {
    May: [
      {
        date: "31 May 2025",
        items: [
          { type: "Others", desc: "Interest", amount: "+5.000" },
          { type: "Others", desc: "Tax", amount: "-Rp1.000" },
        ],
      },
      {
        date: "25 May 2025",
        items: [{ type: "Autodebit", desc: "Life Goals Deposit", amount: "+Rp2.000.000" }],
      },
      {
        date: "5 May 2025",
        items: [{ type: "Top Up", desc: "Life Goals Deposit", amount: "+Rp250.000" }],
      },
    ],
  };

  return { detail: { ...base, user_id: userId, goal_id: goalId }, transactions };
}