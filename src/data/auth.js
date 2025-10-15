// ===== LOGIN DUMMY =====
export const loginUser = async ({ user_id, password }) => {
  await new Promise((r) => setTimeout(r, 600));

  const validUsers = [
    { user_id: "admin", password: "12345" },
    { user_id: "test", password: "abcd" },
  ];

  const user = validUsers.find(
    (u) => u.user_id === user_id && u.password === password
  );

  if (!user) {
    return {
      status: false,
      message: "Invalid User ID or Password.",
    };
  }

  return {
    status: true,
    message: "An OTP code has been sent to your registered email address.",
    otp_ref: "b1f9e0d2-9c2d-4ad2-bd55-8b7fbb6b91e8",
  };
};

// ===== OTP DUMMY =====
let otpAttemptCount = 0;
let isBlocked = false;

export const verifyOtp = async ({ otp_ref, otp_code }) => {
  await new Promise((r) => setTimeout(r, 700));

  if (isBlocked) {
    return {
      status: false,
      message:
        "Your account is temporarily blocked. Please try again later.",
      blocked: true,
    };
  }

  if (otp_ref !== "b1f9e0d2-9c2d-4ad2-bd55-8b7fbb6b91e8") {
    return {
      status: false,
      message: "Invalid or expired OTP reference code.",
    };
  }

  if (otp_code === "123456") {
    otpAttemptCount = 0;
    return {
      status: true,
      message: "Login successful.",
      token: "dummy-jwt-token",
      user: {
        id: "USR001",
        username: "Ulion Pardede",
        role: "admin",
      },
    };
  }

  otpAttemptCount++;
  if (otpAttemptCount >= 3) {
    isBlocked = true;
    return {
      status: false,
      message:
        "Your account has been temporarily blocked due to multiple failed OTP attempts.",
      blocked: true,
    };
  }

  return {
    status: false,
    message: `Incorrect OTP code. Attempt ${otpAttemptCount}/3.`,
  };
};

// ===== RESET / CLEAR FUNCTIONS =====
export const resetOtpState = () => {
  otpAttemptCount = 0;
};

export const clearBlockedUser = () => {
  isBlocked = false;
  otpAttemptCount = 0;
};