const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchSavings(userId) {
  await delay(300);
  return {
    user_id: userId,
    totalBalance: 30000000,
    totalCount: 2,
    deposits: [
      {
        id: 1,
        title: "Taplus Pegawai BNI",
        norekening: "1234567899",
        balance: 7000000,
      },
      {
        id: 2,
        title: "Taplus Bisnis",
        norekening: "9876543211",
        balance: 20000000,
      },
    ],
  };
}

export async function fetchSavingsTransactions(userId, month) {
  await delay(300);
  const allTransactions = [
    { date: "31 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "QRIS", amount: "-Rp15.000" },
    { date: "31 May 2025", month: "May", type: "Taplus Bisnis", detail: "Transfer", amount: "+Rp7.000.000" },
    { date: "30 May 2025", month: "May", type: "Taplus Pegawai BNI", detail: "Admin Fee", amount: "-Rp3.500" },
    { date: "2 June 2025", month: "June", type: "Taplus Bisnis", detail: "Transfer", amount: "-Rp5.000.000" },
  ];
  return allTransactions.filter((tx) => tx.month === month);
}