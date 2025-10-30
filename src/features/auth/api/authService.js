import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


export async function postAuthLogin({ username, password }) {
    try {
        const payload = {
            username,
            password
        }
        const resAuth = await api.post(`/api/auth/login`, payload);
        const data = resAuth.data;
        return { ok: true, data };
    } catch (error) {
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
            otpCode: otp_code
        };
        console.log('zx', sessionID);
        console.log('zx1', otp_code);


        const res = await api.post(`/api/auth/verify-otp`, payload)

        return { ok: true, data: res.data };
    } catch (error) {
        return {
            ok: false,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Verify OTP failed. Please check your code.",
        };

    }
}