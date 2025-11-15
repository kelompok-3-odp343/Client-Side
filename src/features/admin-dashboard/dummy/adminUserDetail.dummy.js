function randAccType() {
    const list = [
        { type: "SAV", name: "Taplus Bisnis" },
        { type: "DEP", name: "Time Deposit" },
        { type: "DPLK", name: "Tabungan Pensiun" },
    ];
    return list[Math.floor(Math.random() * list.length)];
}

const dummyUserDetail = (userId) => {
    return {
        userId: userId,
        customerId: 900000000 + Math.floor(Math.random() * 1000),
        customerName: "Random User " + userId,
        isBlocked: Math.random() < 0.3,
        accounts: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, i) => {
            const acc = randAccType();
            return {
                accountNumber: `12500${i}${Math.floor(Math.random() * 999)}`,
                productType: acc.type,
                productName: acc.name,
                accountStatus: "ACTIVE",
                effectiveBalance: Math.floor(Math.random() * 5000000) + 1000000
            };
        })
    };
};

export default dummyUserDetail;
