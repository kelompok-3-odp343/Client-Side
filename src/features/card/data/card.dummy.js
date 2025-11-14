export const DUMMY_CARDS = [
  {
    account_id: "ACCT001",
    type: "TAPLUS BISNIS",
    account_number: "1234567890",
    account_holder_name: "OKTAVIA QURROTA A'YUNI",
    effective_balance: 25000000,
    is_main: true,
  },
  {
    account_id: "ACCT002",
    type: "TAPLUS MUDA",
    account_number: "9876543210",
    account_holder_name: "OKTAVIA QURROTA A'YUNI",
    effective_balance: 20000000,
    is_main: false,
  },
  {
    account_id: "ACCT003",
    type: "TAPLUS PELAJAR",
    account_number: "1122334455",
    account_holder_name: "OKTAVIA QURROTA A'YUNI",
    effective_balance: 15000000,
    is_main: false,
  },
];


export const DUMMY_TRX_HISTORY = {
  "1234567890": [
    {
      month: 1,
      year: "2025",
      productType: "SAV",
      productSubCategory: "001",
      transaction: [
        {
          transactionId: "TRX-001-01",
          transactionDate: "2025-01-05T08:00:00",
          transactionType: "Transfer",
          debit_credit: "C",
          partyName: "BNI Payroll",
          partyDetail: "Monthly salary",
          amount: 15000000,
        },
        {
          transactionId: "TRX-001-02",
          transactionDate: "2025-01-07T09:00:00",
          transactionType: "QRIS",
          debit_credit: "D",
          partyName: "Coffee Shop",
          partyDetail: "Morning coffee",
          amount: 35000,
          split_bill_id: "SB-101",
        },
      ],
    },
    {
      month: 11,
      year: "2025",
      productType: "SAV",
      productSubCategory: "001",
      transaction: [
        {
          transactionId: "TRX-011-01",
          transactionDate: "2025-11-01T08:00:00",
          transactionType: "Transfer",
          debit_credit: "C",
          partyName: "BNI Payroll",
          partyDetail: "Monthly salary",
          amount: 15000000,
        },
        {
          transactionId: "TRX-011-02",
          transactionDate: "2025-11-05T09:00:00",
          transactionType: "QRIS",
          debit_credit: "D",
          partyName: "Bakso Cak Man",
          partyDetail: "Lunch",
          amount: 35000,
        },
      ],
    },
  ],
  "9876543210": [
    {
      month: 11,
      year: "2025",
      productType: "SAV",
      productSubCategory: "002",
      transaction: [
        {
          transactionId: "TRX2-011-01",
          transactionDate: "2025-11-03T08:00:00",
          transactionType: "Transfer",
          debit_credit: "C",
          partyName: "Client C",
          partyDetail: "Freelance project",
          amount: 8500000,
        },
        {
          transactionId: "TRX2-011-02",
          transactionDate: "2025-11-07T09:00:00",
          transactionType: "Auto Debit",
          debit_credit: "D",
          partyName: "Life Goals - Travel",
          partyDetail: "Auto debit to LFG-003",
          amount: 1000000,
        },
      ],
    },
  ],
  "1122334455": [
    {
      month: 11,
      year: "2025",
      productType: "SAV",
      productSubCategory: "003",
      transaction: [
        {
          transactionId: "TRX3-011-01",
          transactionDate: "2025-11-01T08:00:00",
          transactionType: "Transfer",
          debit_credit: "C",
          partyName: "BNI Payroll",
          partyDetail: "Monthly salary",
          amount: 4000000,
        },
        {
          transactionId: "TRX3-011-02",
          transactionDate: "2025-11-08T08:00:00",
          transactionType: "Auto Debit",
          debit_credit: "D",
          partyName: "DPLK Pension",
          partyDetail: "Monthly contribution",
          amount: 500000,
        },
      ],
    },
  ],
};