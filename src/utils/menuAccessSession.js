export const saveMenuAccessToSession = (menuAccess) => {
    sessionStorage.setItem("menuAccess", JSON.stringify(menuAccess));
};

export const getMenuAccessFromSession = () => {
    const data = sessionStorage.getItem("menuAccess");
    return data ? JSON.parse(data) : null;
};

export const getUserBlockRule = () => {
    const menu = getMenuAccessFromSession();
    return menu?.USER_MANAGEMENT?.USER_BLOCK || null;
};

export const getUserUnblockRule = () => {
    const menu = getMenuAccessFromSession();
    return menu?.USER_MANAGEMENT?.USER_UNBLOCK || null;
};
