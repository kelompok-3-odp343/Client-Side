const productTypes = [
    { code: "SAV", label: "Saving" },
    { code: "TD", label: "Time Deposit" },
    { code: "PF", label: "Pension Fund" },
    { code: "LG", label: "Life Goals" },
];

const categories = ["QRIS", "BILL_PAYMENT", "TOP_UP", "TRANSFER", "E_WALLET"];
const statuses = ["SUCCESS", "FAILED", "PENDING"];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min = 50000, max = 5000000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate() {
    const start = new Date("2025-01-01T00:00:00");
    const end = new Date("2025-12-31T23:59:59");
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
}

const transactionHistories = Array.from({ length: 100 }, (_, i) => {
    const type = randomItem(productTypes);

    return {
        transactionId: `TX${String(i + 1).padStart(3, "0")}`,
        accountNumber: "125125125",
        productType: type.code,
        productTypeLabel: type.label,
        transactionAmount: randomAmount(),
        status: randomItem(statuses),
        paymentTime: randomDate(),
        transactionCategory: randomItem(categories),
    };
});

const adminTransactionDummy = {
    customerId: "124125125",
    nik: "3273200910990003",
    customerName: "Ulion Pardede",
    transactionHistories,
};

export default adminTransactionDummy;
