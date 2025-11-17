function randomStatus() {
    const list = ["PENDING_APPROVER", "PENDING_CHECKER", "REJECTED", "APPROVED"];
    return list[Math.floor(Math.random() * list.length)];
}

function randomFlow() {
    return "CHECKER_AND_APPROVER";
}

function randomAdmin() {
    const admins = ["ADM0001", "ADM0002", "ADM0003", "ADM0004"];
    return admins[Math.floor(Math.random() * admins.length)];
}

function randomDate() {
    const date = new Date(
        2025,
        10,
        Math.ceil(Math.random() * 28),
        Math.floor(Math.random() * 23),
        Math.floor(Math.random() * 59),
        Math.floor(Math.random() * 59)
    );
    return date.toISOString();
}

const dummyActivityList = Array.from({ length: 100 }).map((_, i) => ({
    id: `ACK${100000 + i}`,
    activiationFlow: randomFlow(),
    createdTime: randomDate(),
    createdBy: randomAdmin(),
    checkerId: Math.random() > 0.3 ? randomAdmin() : "",
    approverId: Math.random() > 0.5 ? randomAdmin() : "",
    activityStatus: randomStatus(),
}));

export default dummyActivityList;
