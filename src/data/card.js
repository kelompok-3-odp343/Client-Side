// Simulated API for card details and transactions
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulate /api/funds/{user_id}/cards
 */
export async function fetchCardDetails(userId, accountNumber) {
  await delay(400);

  return {
    status: true,
    message: "Card details fetched successfully",
    data: {
      account_id: "ACCT001",
      account_number: accountNumber,
      account_holder_name: "OKTAVIA QUBROI’A AYUNI",
      type: "TAPLUS BISNIS",
      effective_balance: 25000000,
      currency: "IDR",
      is_main_account: true,
      earnings_overview: {
        income: 17580062,
        expenses: 10580062,
        difference: 7000000,
      },
    },
  };
}

/**
 * Simulate /api/funds/{user_id}/cards/{account_number}/{month}/transactions
 */
export async function fetchCardTransactions(userId, accountNumber, month) {
  await delay(350);

  const allTransactions = [
    {
      trx_id: "TRX001",
      trx_date: "31 May 2025",
      trx_type: "QRIS",
      trx_note: "Warung Kak Ros",
      trx_amount: -25000,
    },
    {
      trx_id: "TRX002",
      trx_date: "31 May 2025",
      trx_type: "QRIS",
      trx_note: "Warung Kak Udin",
      trx_amount: -25000,
    },
    {
      trx_id: "TRX003",
      trx_date: "30 May 2025",
      trx_type: "Transfer",
      trx_note: "BNI - Gajian uhuy",
      trx_amount: 50000000,
    },
    {
      trx_id: "TRX004",
      trx_date: "30 May 2025",
      trx_type: "E-Wallet",
      trx_note: "Top Up OVO - 0123456789",
      trx_amount: -25000,
    },
  ];

  const filtered = allTransactions.filter((t) =>
    t.trx_date.includes(month)
  );

  return {
    status: "success",
    message: `Card transactions fetched successfully for ${month}`,
    data: filtered,
  };
}