import axios from 'axios';

export async function postAuthLogin({ username, password }) {
    try {
        const payload = {
            username,
            password
        }
        const resAuth = await axios.post(`/api/auth/login`, payload);
        const data = resAuth.data;
        return { ok: true, data };
    } catch (error) {
        return {
            ok: false,
            message: error?.response?.data?.message || 'Login Failed'
        }
    }
}

export async function postVerifyOtp({ otp_ref, otp_code }) {
    try {
        const payload = {
            otp_ref,
            otp_code
        };

        const res = await axios.post(`/api/auth/verify-otp`, payload)

        return { ok: true, data: res.data };
    } catch (error) {
        return {
            ok: false,
            message: err?.response?.data?.message || "Verify OTP failed",
        }
    }
}