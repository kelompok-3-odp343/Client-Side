import dummyActivityList from "./adminActivity.dummy";

function randomReason() {
    const list = [
        "Terindikasi percobaan penipuan",
        "Percobaan login yang mencurigakan",
        "Penggunaan akun tidak wajar",
        "Terindikasi pelanggaran kebijakan",
        "Verifikasi identitas gagal",
        "Terindikasi terorisme",
        "Data tidak valid",
        "Aktivitas transfer mencurigakan",
        "Kesalahan input data oleh user",
        "Butuh pemeriksaan lanjutan"
    ];
    return list[Math.floor(Math.random() * list.length)];
}

function randomMenu() {
    const list = ["USER_MANAGEMENT", "ACCOUNT_MANAGEMENT", "SECURITY_CONTROL"];
    return list[Math.floor(Math.random() * list.length)];
}

function randomMenuAction() {
    const list = ["BLOCK_USER", "UNBLOCK_USER", "RESET_PASSWORD"];
    return list[Math.floor(Math.random() * list.length)];
}

function randomUser(i) {
    return {
        userId: `P${String(i).padStart(3, "0")}`,
        customerId: `CIF${String(i).padStart(4, "0")}`,
        customerName: [
            "Ulion Pardede",
            "Khairuddin Nasti",
            "Wira Natanael Uli",
            "Della Puspita",
            "Andika Hasibuan",
            "Fajar Siregar",
            "Fajar Puspita",
            "Nanda Sihombing",
            "Andre Naibaho",
            "Sinta Hutapea"
        ][i % 10]
    };
}

function formatCheckerTime(status, baseDate, checkerId) {
    if (!checkerId) return "";
    if (status === "PENDING_CHECKER") return "";
    if (status === "PENDING_APPROVER" || status === "APPROVED" || status === "REJECTED") {
        const dt = new Date(baseDate);
        dt.setHours(dt.getHours() + 1);
        return dt.toISOString().replace("Z", "TZ");
    }
    return "";
}

function formatApproverTime(status, baseDate, approverId) {
    if (!approverId) return "";
    if (status === "PENDING_APPROVER") return "";
    if (status === "APPROVED" || status === "REJECTED") {
        const dt = new Date(baseDate);
        dt.setHours(dt.getHours() + 2);
        return dt.toISOString().replace("Z", "TZ");
    }
    return "";
}

const dummyActivityDetailList = dummyActivityList.map((activity, i) => {
    const baseDate = activity.createdTime.replace("Z", "TZ");

    return {
        activityId: activity.id,

        activityData: randomUser(i),

        checkerData: activity.checkerId
            ? {
                npp: `NPP${1000 + i}`,
                checkerName: ["Ulion Pardede", "Wira Natanael Uli", "Della Puspita"][i % 3]
            }
            : {},

        approverData: activity.approverId
            ? {
                npp: `APP${2000 + i}`,
                approverName: ["Khairuddin Nasti", "Andika Hasibuan"][i % 2]
            }
            : {},

        status: activity.activityStatus,

        reason: randomReason(),

        menu: randomMenu(),

        menu_action: randomMenuAction(),

        created_time: baseDate,

        checker_updated_time: formatCheckerTime(
            activity.activityStatus,
            activity.createdTime,
            activity.checkerId
        ),

        maker_updated_time: "",

        approver_updated_time: formatApproverTime(
            activity.activityStatus,
            activity.createdTime,
            activity.approverId
        )
    };
});

export default dummyActivityDetailList;
