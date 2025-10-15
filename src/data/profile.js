// Simulasi endpoint profil user

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ambil data profil user.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function fetchUserProfile(userId) {
  await delay(300);
  return {
    user_id: userId,
    name: "Ulion Pardede",
    cif: "9285711829",
    dob: "28 August 1995",
    email: "ulion99pardede@gmail.com",
    phone: "082376180082",
  };
}