const generateDummyUsers = (count = 100) => {
    const firstNames = ["Ulion", "Wira", "Della", "Raihan", "Khairuddin", "Erlangga", "Oktavia", "Natasya", "Andika", "Fajar"];
    const middleNames = ["", "Natanael", "Putra", "Wahyu", "Uli", "Puspita", "Anggraini", "Aulia"];
    const lastNames = ["Pardede", "Hasibuan", "Ginting", "Saragih", "Siregar", "Lubis", "Situmorang", "Siregar"];

    const list = [];

    for (let i = 1; i <= count; i++) {
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const mname = middleNames[Math.floor(Math.random() * middleNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];

        const fullName = [fname, mname, lname].filter(Boolean).join(" ");

        list.push({
            userId: `USER_${i}`,
            customerId: `${100000000 + i}`,
            customerName: fullName,
            countAccount: Math.floor(Math.random() * 5) + 1,
            isBlocked: Math.random() < 0.2
        });
    }

    return list;
};

const adminUsersDummy = {
    totalUsers: 2314615,
    activeUsers: 2310000,
    blockedUsers: 24500,
    avgAccountPerUser: 4,
    users: generateDummyUsers(100)
};

export default adminUsersDummy;
