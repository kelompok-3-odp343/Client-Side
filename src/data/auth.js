// Simulasi backend login dan OTP

const users = [
  { userId: "admin", password: "12345", email: "admin@demo.com" },
  { userId: "test", password: "abcd", email: "test@demo.com" },
];

// Simulasi delay API
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulasi endpoint login
 * @param {string} userId
 * @param {string} password
 * @returns {Promise<{email: string}>}
 */
export async function loginApi(userId, password) {
  await delay(800);
  const found = users.find(
    (u) => u.userId === userId && u.password === password
  );
  if (!found) throw new Error("Invalid User ID or Password.");
  return { email: found.email };
}


/**
 * Simulasi endpoint verifikasi OTP
 * @param {string} otp
 * @returns {Promise<{success: boolean}>}
 */
export async function verifyOtpApi(otp) {
  await new Promise((r) => setTimeout(r, 600));
  if (otp === "123456") {
    return { success: true };
  }
  throw new Error("Invalid OTP");
}

/**
 * Simulasi pemblokiran user setelah gagal OTP 3x
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function blockUser(email) {
  await new Promise((r) => setTimeout(r, 400));
  localStorage.setItem("blockedUser", email);
  return true;
}

/**
 * Mengecek apakah user sedang diblokir
 * @returns {string|null} email user yang diblokir
 */
export function getBlockedUser() {
  return localStorage.getItem("blockedUser");
}

/**
 * Membuka blokir user (simulasi)
 */
export function clearBlockedUser() {
  localStorage.removeItem("blockedUser");
}