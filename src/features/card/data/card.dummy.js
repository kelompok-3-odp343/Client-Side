export const DUMMY_CARDS = [
  {
    account_id: "ACCT001",
    type: "TAPLUS BISNIS",
    account_number: "1234567890",
    account_holder_name: "OKTAVIA QURROTA A’YUNI",
    effective_balance: 25000000,
    is_main: true,
  },
  {
    account_id: "ACCT002",
    type: "TAPLUS MUDA",
    account_number: "9876543210",
    account_holder_name: "OKTAVIA QURROTA A’YUNI",
    effective_balance: 20000000,
    is_main: false,
  },
  {
    account_id: "ACCT003",
    type: "TAPLUS PELAJAR",
    account_number: "1122334455",
    account_holder_name: "OKTAVIA QURROTA A’YUNI",
    effective_balance: 15000000,
    is_main: false,
  },
];

/* ============================================================
   DUMMY TRANSACTIONS — FULL MONTHS FOR EACH ACCOUNT
   ============================================================ */
export const DUMMY_TRANSACTIONS = {
  /* ================== ACCOUNT 1 — TAPLUS BISNIS ================== */
  ACCT001: [
    {
      month: "May",
      date: "30 May 2025",
      items: [
        { type: "QRIS", detail: "Warung Kak Ros", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
        { type: "QRIS", detail: "Bakmi Jaya", amount: "-Rp45.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "May",
      date: "28 May 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp10.000.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "Top Up GoPay", amount: "-Rp100.000", jenisTransaksi: "Pengeluaran" },
        { type: "QRIS", detail: "Alfamart", amount: "-Rp60.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "May",
      date: "25 May 2025",
      items: [
        { type: "Transfer", detail: "Bayar Kos", amount: "-Rp2.000.000", jenisTransaksi: "Pemasukan" },
      ],
    },

    {
      month: "June",
      date: "02 June 2025",
      items: [
        { type: "Transfer", detail: "BNI - Gajian", amount: "+Rp10.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Starbucks Sudirman", amount: "-Rp75.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "June",
      date: "05 June 2025",
      items: [
        { type: "E-Wallet", detail: "OVO Top Up", amount: "-Rp100.000", jenisTransaksi: "Pengeluaran" },
        { type: "QRIS", detail: "Warung Kak Udin", amount: "-Rp35.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "June",
      date: "15 June 2025",
      items: [
        { type: "Transfer", detail: "Invoice Payment", amount: "+Rp7.500.000", jenisTransaksi: "Pemasukan" },
      ],
    },

    {
      month: "July",
      date: "10 July 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "McDonald's", amount: "-Rp65.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "July",
      date: "12 July 2025",
      items: [
        { type: "QRIS", detail: "Indomaret", amount: "-Rp35.000", jenisTransaksi: "Pengeluaran" },
        { type: "E-Wallet", detail: "ShopeePay", amount: "-Rp120.000", jenisTransaksi: "Pengeluaran" },
      ],
    },

    {
      month: "August",
      date: "05 Aug 2025",
      items: [
        { type: "Transfer", detail: "Client Project Payment", amount: "+Rp20.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kantin Kampus", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "August",
      date: "15 Aug 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Pak Gendut", amount: "-Rp30.000", jenisTransaksi: "Pengeluaran" },
      ],
    },

    {
      month: "September",
      date: "01 Sept 2025",
      items: [
        { type: "Transfer", detail: "Client Retainer", amount: "+Rp12.000.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "Top Up Dana", amount: "-Rp200.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "September",
      date: "20 Sept 2025",
      items: [
        { type: "QRIS", detail: "Sate Ayam Pak Min", amount: "-Rp40.000", jenisTransaksi: "Pengeluaran" },
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
      ],
    },

    {
      month: "October",
      date: "10 Oct 2025",
      items: [
        { type: "Transfer", detail: "Invoice Payment", amount: "+Rp10.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Coffee Shop", amount: "-Rp50.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "October",
      date: "25 Oct 2025",
      items: [
        { type: "E-Wallet", detail: "ShopeePay Top Up", amount: "-Rp150.000", jenisTransaksi: "Pengeluaran" },
      ],
    },

    {
      month: "November",
      date: "05 Nov 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Restoran Padang", amount: "-Rp90.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "November",
      date: "19 Nov 2025",
      items: [
        { type: "QRIS", detail: "Bakso Cak Man", amount: "-Rp35.000", jenisTransaksi: "Pengeluaran" },
        { type: "Transfer", detail: "Client Retainer", amount: "+Rp15.000.000", jenisTransaksi: "Pemasukan" },
      ],
    },

    {
      month: "December",
      date: "01 Dec 2025",
      items: [
        { type: "Transfer", detail: "Bonus Akhir Tahun", amount: "+Rp25.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Warung Sederhana", amount: "-Rp40.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "December",
      date: "20 Dec 2025",
      items: [
        { type: "QRIS", detail: "Starbucks", amount: "-Rp75.000", jenisTransaksi: "Pengeluaran" },
        { type: "Transfer", detail: "Gift Transfer", amount: "-Rp500.000", jenisTransaksi: "Pengeluaran" },
      ],
    },

    {
      month: "January",
      date: "10 Jan 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kopi Nako", amount: "-Rp45.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "February",
      date: "05 Feb 2025",
      items: [
        { type: "Transfer", detail: "Client Project Fee", amount: "+Rp18.000.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "Top Up Ovo", amount: "-Rp150.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "March",
      date: "12 Mar 2025",
      items: [
        { type: "Transfer", detail: "BNI Payroll", amount: "+Rp45.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Pak Kumis", amount: "-Rp35.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "April",
      date: "08 Apr 2025",
      items: [
        { type: "Transfer", detail: "Project Fee", amount: "+Rp30.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Alfamart", amount: "-Rp50.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
  ],

  /* ================== ACCOUNT 2 — TAPLUS MUDA ================== */
  ACCT002: [
    {
      month: "May",
      date: "20 May 2025",
      items: [
        { type: "Transfer", detail: "Parent Allowance", amount: "+Rp1.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Malang", amount: "-Rp30.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "June",
      date: "10 June 2025",
      items: [
        { type: "Transfer", detail: "Freelance Payment", amount: "+Rp2.000.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "Top Up Dana", amount: "-Rp100.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "July",
      date: "12 July 2025",
      items: [
        { type: "Transfer", detail: "Freelance Payment", amount: "+Rp2.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Warung Kopi", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "August",
      date: "05 Aug 2025",
      items: [
        { type: "Transfer", detail: "Allowance", amount: "+Rp1.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Soto Betawi", amount: "-Rp30.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "September",
      date: "18 Sept 2025",
      items: [
        { type: "Transfer", detail: "Scholarship", amount: "+Rp3.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Starbucks", amount: "-Rp60.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "October",
      date: "02 Oct 2025",
      items: [
        { type: "Transfer", detail: "Allowance", amount: "+Rp1.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kantin Kampus", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "November",
      date: "12 Nov 2025",
      items: [
        { type: "Transfer", detail: "Side Project", amount: "+Rp2.000.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "ShopeePay", amount: "-Rp80.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "December",
      date: "05 Dec 2025",
      items: [
        { type: "Transfer", detail: "Freelance Bonus", amount: "+Rp2.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Burger King", amount: "-Rp50.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "January",
      date: "08 Jan 2025",
      items: [
        { type: "Transfer", detail: "Part-time Salary", amount: "+Rp1.800.000", jenisTransaksi: "Pemasukan" },
        { type: "E-Wallet", detail: "Top Up GoPay", amount: "-Rp70.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "February",
      date: "17 Feb 2025",
      items: [
        { type: "Transfer", detail: "Allowance", amount: "+Rp1.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Indomaret", amount: "-Rp45.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "March",
      date: "20 Mar 2025",
      items: [
        { type: "Transfer", detail: "Project Fee", amount: "+Rp3.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Warteg Sejahtera", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "April",
      date: "15 Apr 2025",
      items: [
        { type: "Transfer", detail: "Allowance", amount: "+Rp1.500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Es Teh Indonesia", amount: "-Rp20.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
  ],

  /* ================== ACCOUNT 3 — TAPLUS PELAJAR ================== */
  ACCT003: [
    {
      month: "May",
      date: "18 May 2025",
      items: [
        { type: "Transfer", detail: "Orang Tua", amount: "+Rp500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kantin Sekolah", amount: "-Rp20.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "June",
      date: "04 June 2025",
      items: [
        { type: "Transfer", detail: "Beasiswa", amount: "+Rp3.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Pak Kumis", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "July",
      date: "08 July 2025",
      items: [
        { type: "Transfer", detail: "Orang Tua", amount: "+Rp500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Jajanan Sekolah", amount: "-Rp15.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "August",
      date: "11 Aug 2025",
      items: [
        { type: "Transfer", detail: "Beasiswa", amount: "+Rp3.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kantin Kampus", amount: "-Rp30.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "September",
      date: "16 Sept 2025",
      items: [
        { type: "Transfer", detail: "Uang Jajan", amount: "+Rp400.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Warung Nasi", amount: "-Rp15.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "October",
      date: "19 Oct 2025",
      items: [
        { type: "Transfer", detail: "Beasiswa Tambahan", amount: "+Rp1.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Indomaret", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "November",
      date: "10 Nov 2025",
      items: [
        { type: "Transfer", detail: "Orang Tua", amount: "+Rp500.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Pak Kumis", amount: "-Rp15.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "December",
      date: "15 Dec 2025",
      items: [
        { type: "Transfer", detail: "Uang Natal", amount: "+Rp800.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Martabak", amount: "-Rp20.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "January",
      date: "10 Jan 2025",
      items: [
        { type: "Transfer", detail: "Orang Tua", amount: "+Rp400.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Kantin Sekolah", amount: "-Rp10.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "February",
      date: "08 Feb 2025",
      items: [
        { type: "Transfer", detail: "Beasiswa", amount: "+Rp2.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Warung Sederhana", amount: "-Rp15.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "March",
      date: "05 Mar 2025",
      items: [
        { type: "Transfer", detail: "Orang Tua", amount: "+Rp400.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Jajanan", amount: "-Rp10.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
    {
      month: "April",
      date: "03 Apr 2025",
      items: [
        { type: "Transfer", detail: "Beasiswa", amount: "+Rp3.000.000", jenisTransaksi: "Pemasukan" },
        { type: "QRIS", detail: "Bakso Pak Kumis", amount: "-Rp25.000", jenisTransaksi: "Pengeluaran" },
      ],
    },
  ],
};