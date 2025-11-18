import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function postAuthLogin({ username, password }) {
  try {
    const payload = { username, password };
    const resAuth = await api.post(`/api/auth/login`, payload);
    const data = resAuth.data;
    return { ok: true, data };
  } catch (error) {
    if (import.meta.env.MODE !== "production") {
      const uname = username?.toLowerCase?.() || "";

      // Admin dummy
      if (uname === "admin" && password === "password") {
        return {
          ok: true,
          data: {
            status: true,
            sessionIdOrToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJQMDAzIiwicm9sZSI6Ik1BS0VSIiwiZW1haWwiOiJva3RhdmlhcS5hQGdtYWlsLmNvbSIsIm5wcCI6IjY0ODg5IiwiaWF0IjoxNzYzMzY1Nzk4LCJleHAiOjE3NjMzNjkzOTh9.Sh7mrZUbO5q1Mx9zODflUlp6bRNNGO71v4xMrjc03bw",
            message: "DEV: Admin login success",
          },
        };

      }

      if (uname === "user" && password === "password") {
        return {
          ok: true,
          data: {
            status: true,
            sessionIdOrToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJQMDAzIiwiY2lmIjoiQ0lGMDAzIiwicm9sZSI6Ik5BU0FCQUgiLCJ1c2VybmFtZSI6IlAwMDMiLCJpYXQiOjE3NjMzOTIxNDksImV4cCI6MTc2MzM5NTc0OX0.Q49wJYYTQGjOszvJkfsM5itYzGbXZ9icnpQcDum7pmY",
            message: "DEV: User login success",
          },
        };

      }

      return {
        ok: false,
        message: "Invalid username or password (DEV MODE)",
      };
    }

    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed. Please check your credentials.",
    };
  }
}

export async function postVerifyOtp({ sessionID, otp_code }) {
  try {
    const payload = {
      sessionId: sessionID,
      otpCode: otp_code,
    };
    const res = await api.post(`/api/auth/verify-otp`, payload);
    return { ok: true, data: res.data };
  } catch (error) {
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

export async function postResendOtp({ sessionID }) {
  try {
    const payload = { sessionId: sessionID };
    const res = await api.post(`/api/auth/resend-otp`, payload);
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengirim ulang kode OTP. Silakan coba beberapa saat lagi.",
    };
  }
}

/**
 * @param {string} username
 */
export async function postForgotPasswordRequestOtp({ username }) {
  try {
    const res = await api.post(`/api/auth/forgot-password/request-otp`, {
      username,
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengirim OTP. Silakan coba lagi.",
    };
  }
}

/**
 * @param {string} sessionId
 * @param {string} otpCode
 */
export async function postForgotPasswordVerifyOtp({ sessionId, otpCode }) {
  try {
    const res = await api.post(`/api/auth/forgot-password/verify-otp`, {
      sessionId,
      otpCode,
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Verifikasi OTP gagal. Silakan coba lagi.",
    };
  }
}

/**
 * @param {string} verifiedSession
 * @param {string} newPassword
 * @param {string} confirmPassword
 */
export async function postForgotPasswordReset({
  verifiedSession,
  newPassword,
  confirmPassword,
}) {
  try {
    const res = await api.post(`/api/auth/forgot-password/reset-password`, {
      verifiedSession,
      newPassword,
      confirmPassword,
    });
    return { ok: true, data: res.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui password. Silakan coba beberapa saat lagi.",
    };
  }
}