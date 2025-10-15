// Simulated API endpoint for user profile
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

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