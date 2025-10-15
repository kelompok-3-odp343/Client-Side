// Simulated API for Time Deposits
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulate /api/time-deposits/{user_id}
 */
export async function fetchDeposits(userId) {
  await delay(400);

  return {
    status: true,
    message: "Time deposits fetched successfully",
    data: {
      fund_id: "AGG_TIMEDEPOSITS_" + userId,
      title: "Time Deposits",
      total_balance: 5000000,
      count_accounts: 2,
      items: [
        {
          id: "TD001",
          deposit_account_number: "888001",
          cif: "CIF001",
          account_holder_name: "Ulion Pardede",
          account_type: "DEP",
          sub_cat: "Short Term Deposit",
          balance: 2000000,
          currency_code: "IDR",
          interest_rate: 3.5,
          tenor_months: 6,
          interest_payment_type: "rollover",
          maturity_date: "2025-11-01T00:00:00Z",
          created_time: "2025-05-01T08:00:00Z",
        },
        {
          id: "TD002",
          deposit_account_number: "888002",
          cif: "CIF001",
          account_holder_name: "Ulion Pardede",
          account_type: "DEP",
          sub_cat: "Long Term Deposit",
          balance: 3000000,
          currency_code: "IDR",
          interest_rate: 4.0,
          tenor_months: 12,
          interest_payment_type: "autorollover",
          maturity_date: "2026-03-15T00:00:00Z",
          created_time: "2025-03-15T08:00:00Z",
        },
      ],
    },
  };
}

/**
 * Simulate /api/funds/{user_id}/Deposits/{month}/transactions
 */
export async function fetchDepositTransactions(userId, month) {
  await delay(350);

  const all = [
    {
      id: "TRX001",
      user_id: userId,
      account_number: "12345678910",
      trx_date: "31 May 2025",
      trx_cat_id: "CAT001",
      trx_amount: -1000,
      trx_target: "BILL001",
      trx_note: "Admin Fee",
      trx_type: "DEBIT",
      created_by: "system",
    },
    {
      id: "TRX002",
      user_id: userId,
      account_number: "12345678910",
      trx_date: "31 May 2025",
      trx_cat_id: "CAT002",
      trx_amount: -7,
      trx_target: "BILL002",
      trx_note: "Management Fee",
      trx_type: "DEBIT",
      created_by: "system",
    },
    {
      id: "TRX003",
      user_id: userId,
      account_number: "12345678910",
      trx_date: "30 Apr 2025",
      trx_cat_id: "CAT003",
      trx_amount: -3500,
      trx_target: "BILL003",
      trx_note: "Deposit Placement",
      trx_type: "DEBIT",
      created_by: "system",
    },
  ];

  const filtered = all.filter((t) => t.trx_date.includes(month));

  return {
    status: "success",
    message: `Transaction history fetched successfully for ${month}`,
    data: filtered,
  };
}