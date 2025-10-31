import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Login utama, terintegrasi ke API.
 * Jika API gagal, sistem pakai dummy login (DEV ONLY) agar bisa tes admin & nasabah.
 */
export async function postAuthLogin({ username, password }) {
  try {
    const payload = { username, password };
    const resAuth = await api.post(`/api/auth/login`, payload);
    const data = resAuth.data;
    return { ok: true, data };
  } catch (error) {
    // === Fallback development-only (API off, dummy credentials) ===
    if (import.meta.env.MODE !== "production") {
      const uname = username?.toLowerCase?.() || "";

      // Admin dummy
      if (uname === "admin" && password === "password") {
        return {
          ok: true,
          data: {
            status: true,
            sessionId: "ADMIN_DEV_SESSION",
            token: "ADMIN_DEV_TOKEN",
            role: "admin",
            message: "DEV: Admin login success (offline mode)",
          },
        };
      }

      // Nasabah dummy
      if (uname === "user" && password === "password") {
        return {
          ok: true,
          data: {
            status: true,
            sessionId: "USER_DEV_SESSION",
            token: "USER_DEV_TOKEN",
            role: "user",
            message: "DEV: User login success (offline mode)",
          },
        };
      }

      // OTP dummy untuk keduanya
      return {
        ok: false,
        message: "Invalid username or password (DEV MODE)",
      };
    }

    // === Production: tetap error API ===
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed. Please check your credentials.",
    };
  }
}

/**
 * OTP verification — tetap panggil API
 */
export async function postVerifyOtp({ sessionID, otp_code }) {
  try {
    const payload = {
      sessionId: sessionID,
      otpCode: otp_code,
    };
    const res = await api.post(`/api/auth/verify-otp`, payload);
    return { ok: true, data: res.data };
  } catch (error) {
    // Fallback OTP untuk DEV mode
    if (import.meta.env.MODE !== "production") {
      if (otp_code === "123456" || otp_code === "000000") {
        return {
          ok: true,
          data: { status: true, message: "DEV: OTP Verified", token: "DEV_TOKEN" },
        };
      }
    }
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Verify OTP failed. Please check your code.",
    };
  }
}