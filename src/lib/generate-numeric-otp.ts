import crypto from "crypto";

export function generateNumericOtp(length = 6) {
  // crypto-secure numeric OTP
  const digits = "0123456789";
  let otp = "";
  // use crypto.randomInt for each digit
  for (let i = 0; i < length; i++) {
    const n = crypto.randomInt(0, digits.length);
    otp += digits[n];
  }
  return otp;
}
