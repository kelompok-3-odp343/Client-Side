// helper untuk membuat transaksi acak realistis
function makeTx(monthName, count, baseDate, baseAmount = 1000000) {
  const groups = [];
  for (let i = 1; i <= count; i++) {
    const date = `${String(i).padStart(2, "0")} ${monthName} 2025`;
    groups.push({
      date,
      items: [
        {
          type: i % 2 === 0 ? "Autodebit" : "Top Up",
          desc: i % 2 === 0 ? "Monthly Deposit" : "Manual Deposit",
          amount: `+Rp${(baseAmount + i * 1000).toLocaleString("id-ID")}`,
        },
        {
          type: "Others",
          desc: "Interest",
          amount: `+Rp${(3000 + (i % 5) * 500).toLocaleString("id-ID")}`,
        },
        ...(i % 4 === 0
          ? [
              {
                type: "Others",
                desc: "Tax",
                amount: `-Rp${(500 + (i % 3) * 100).toLocaleString("id-ID")}`,
              },
            ]
          : []),
      ],
    });
  }
  return groups;
}

// setiap goal punya 12 bulan (May–Apr), tiap bulan 5–8 grup transaksi
const months = ["May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const LIFE_GOALS_TX_DUMMY = {
  EDU001: Object.fromEntries(months.map((m) => [m, makeTx(m, 8, 1, 1500000)])),
  VAC001: Object.fromEntries(months.map((m) => [m, makeTx(m, 6, 1, 1200000)])),
  MAR001: Object.fromEntries(months.map((m) => [m, makeTx(m, 7, 1, 1000000)])),
  HOM001: Object.fromEntries(months.map((m) => [m, makeTx(m, 8, 1, 2000000)])),
  GAD001: Object.fromEntries(months.map((m) => [m, makeTx(m, 5, 1, 500000)])),
  VEH001: Object.fromEntries(months.map((m) => [m, makeTx(m, 6, 1, 800000)])),
};

export default LIFE_GOALS_TX_DUMMY;