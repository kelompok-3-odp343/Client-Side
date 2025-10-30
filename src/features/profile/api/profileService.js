import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
export const getUserProfile = async () => {
    try {
        const response = await api.get("/api/user/profile");

        if (response.data && response.data.status === true) {
            console.log("api profil");
            return response.data;
        } else {
            throw new Error("Invalid API response structure");
        }
    } catch (error) {
        console.warn("data dummy untuk profil", error.message);

        const dummyResponse = {
            status: true,
            message: "Profile retrieved successfully (dummy)",
            data: {
                profile: {
                    id: "USR001",
                    cif: "9285711829",
                    username: "ulion",
                    first_name: "Ulion",
                    middle_name: "",
                    last_name: "Pardede",
                    dob: "2000-08-28T00:00:00Z",
                    phone_number: "082376180082",
                    email_address: "ulion99pardede@gmail.com",
                },
            },
        };

        await new Promise((resolve) => setTimeout(resolve, 800));
        return dummyResponse;
    }
};