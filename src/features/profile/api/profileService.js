import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Dummy profile data
const DUMMY_PROFILE = {
  cif: "1234567890",
  firstName: "Oktavia",
  middleName: "Qurrota",
  lastName: "A'yuni",
  dob: "2000-01-15T00:00:00.000Z",
  emailAddress: "oktavia.ayuni@example.com",
  phoneNumber: "+62812345678910"
};

export const getUserProfile = async () => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.warn("⚠️ No token found, using dummy profile");
      return DUMMY_PROFILE;
    }

    const res = await api.get("/api/v1/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    
    if (res.data?.status && res.data?.data) {
      return res.data.data;
    }
    
    console.warn("⚠️ API returned invalid data, using dummy profile");
    return DUMMY_PROFILE;
  } catch (error) {
    console.warn("⚠️ Profile API failed, using dummy:", error?.message);
    return DUMMY_PROFILE;
  }
};