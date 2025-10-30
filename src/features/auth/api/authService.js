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
        // REAL RESPONSE
        // return {
        //     ok: false,
        //     message: error?.response?.data?.message || 'Login Failed'
        // }

        //dummy sementara
        return {
            ok: true,
            data: {
                otpRef: "DUMMY-OTP-REF-12345"
            }
        };
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
        // REAL API
        // return {
        //     ok: false,
        //     message: err?.response?.data?.message || "Verify OTP failed",
        // }

        // dummy sementara
        return {
            ok: true,
            data: {
                token: "DUMMY-TOKEN-ABCDEF",
                user: {
                    userId: "P001",
                    username: "dummyuser",
                    cif: "CIF001"
                }
            }
        }
    }
}