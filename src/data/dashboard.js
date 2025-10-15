// Simulated Dashboard API
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchDashboardData(userId) {
  await delay(500);

  return {
    status: true,
    message: "Dashboard data fetched successfully",
    data: {
      meta: {
        user_id: userId,
        username: "ulion",
        name: "Ulion Pardede",
        currency: "IDR",
        date_from: "2025-05-01",
        date_to: "2025-05-31",
      },
      assets_total: {
        total: 17580062,
        currency: "IDR",
        extra_this_month: 20000,
        breakdown: {
          income: 17580062,
          expenses: 10580062,
          receivable: 17580062,
        },
      },
      time_deposits: {
        fund_id: "AGG_TIMEDEPOSITS_USR001",
        title: "Time Deposits",
        total_balance: 5000000,
        count_accounts: 2,
      },
      savings: [
        {
          account_id: "ACCT_12345678910",
          title: "Savings - TAPLUS BISNIS",
          total_balance: 12000000000,
        },
      ],
      pension_funds: [
        {
          fund_id: "DPLK_0001",
          title: "Pension Funds - DPLK12345",
          total_balance: 15000000,
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
            is_main_account: true,
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
      earnings_overview: {
        income: 17580062,
        expenses: 10580062,
        difference: 7000000,
      },
      recent_trx_summary: {
        count_30_days: 12,
        latest_items: [
          {
            trx_id: "TRX001",
            date: "2025-05-31T10:15:00Z",
            title: "QRIS - Warung Kak Ros",
            amount: -25000,
            trx_type: "DEBIT",
          },
        ],
      },
      split_bill: {
        summary: {
          total_split_bill: 4,
          total_amount: 32580062,
          total_paid: 2,
          total_unpaid: 2,
          remaining_bill: 2000000,
          potential_accumulation: 32580062,
        },
      },
    },
  };
}