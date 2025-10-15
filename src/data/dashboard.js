// src/data/dashboard.js
// Simulasi API Dashboard

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulasi endpoint dashboard user.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function fetchDashboardData(userId) {
  await delay(600);

  // data dummy yang realistis
  return {
    meta: { user_id: userId, name: "Ulion Pardede", currency: "IDR" },
    assets_total: { total: 17580062, extra_this_month: 20000 },
    earnings_overview: { income: 17580062, expenses: 10580062 },
    split: { progress: 100, remaining: 2000000, potential: 32580062, ongoing: 4 },
    time_deposits: { total_balance: 15000000, count_accounts: 2 },
    savings: [
      {
        group_id: "SAV_001",
        title: "Savings - TAPLUS BISNIS",
        total_balance: 12000000000,
        items: [
          {
            account_id: "ACCT_1",
            account_number: "1234567890",
            balance: 8000000000,
            currency_code: "IDR",
          },
          {
            account_id: "ACCT_2",
            account_number: "1234567891",
            balance: 4000000000,
            currency_code: "IDR",
          },
        ],
      },
    ],
    pension_funds: [
      {
        group_id: "PF_001",
        title: "Pension Fund - DPLK BNI",
        total_balance: 15000000,
        items: [
          {
            account_id: "DPLK_0001",
            deposit_account_number: "DPLK12345",
            balance: 15000000,
            maturity_date: "2026-06-01",
            currency_code: "IDR",
          },
        ],
      },
    ],
    life_goals: [
      {
        goal_group_id: "LG_023",
        title: "Life Goals",
        total_balance: 50000000,
        goals: [
          {
            goal_id: "LG_023",
            name: "Education",
            current_savings: 50000000,
            target: 100000000,
          },
        ],
      },
    ],
    cards: {
      active_count: 3,
      list: [
        {
          account_id: "ACCT001",
          type: "TAPLUS BISNIS",
          account_number: "12345678910",
          effective_balance: 50000000,
        },
        {
          account_id: "ACCT002",
          type: "TEST 1",
          account_number: "12345678911",
          effective_balance: 40000000,
        },
        {
          account_id: "ACCT003",
          type: "TEST 2",
          account_number: "12345678912",
          effective_balance: 30000000,
        },
      ],
    },
    recent_trx_summary: { latest_items: [] },
  };
}