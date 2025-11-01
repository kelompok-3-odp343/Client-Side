import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/user/profile");
    if (res.data?.status) return res.data;
    throw new Error("Invalid API response");
  } catch {
    console.warn("Using dummy profile data (fallback)");
    return {
      status: true,
      data: {
        profile: {
          id: "USR001",
          cif: "9285711829",
          username: "ulion",
          first_name: "Ulion",
          middle_name: "",
          last_name: "Pardede",
          dob: "1995-08-28T00:00:00Z",
          phone_number: "082376180082",
          email_address: "ulion99pardede@gmail.com",
        },
      },
    };
  }
};