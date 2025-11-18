import { jwtDecode } from "jwt-decode";

/**
 * @param {string} token
 * @returns {object|null}
 */
export function decodeJwtToken(token) {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
}
