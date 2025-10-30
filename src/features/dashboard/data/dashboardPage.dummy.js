export const DASHBOARD_DUMMY = {
    assetoverview: {
        totalAsset: 152350000,
    },
    cashFlowOverview: {
        totalIncome: 8500000,
        totalExpense: 4300000,
        totalReceivable: 1200000,
    },
    splitBillOverview: {
        totalBillAmount: 5000000,
        remainingBillAmount: 2000000,
        countSplitBill: 3,
    },
    portfolioOverview: [
        { productName: "timeDeposit", totalAmount: 25000000 },
        { productName: "accountSavings", totalAmount: 36000000 },
        { productName: "lifegoals", totalAmount: 9000000 },
        { productName: "dplk", totalAmount: 14000000 },
    ],
    accountList: [
        {
            account_product_name: "Savings Account",
            account_number: "1234567890",
            debit_card_number: "5264123412341234",
            account_name: "John Doe",
        },
        {
            account_product_name: "Time Deposit",
            account_number: "9876543210",
            debit_card_number: null,
            account_name: "John Doe",
        },
    ],
};
