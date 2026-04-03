const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const setOtp = (identifier, otp) => {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS
  });
};

const verifyOtp = (identifier, otp) => {
  const otpEntry = otpStore.get(identifier);

  if (!otpEntry) {
    return false;
  }

  if (Date.now() > otpEntry.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }

  const isValid = otpEntry.otp === String(otp);

  if (isValid) {
    otpStore.delete(identifier);
  }

  return isValid;
};

module.exports = {
  generateOtp,
  setOtp,
  verifyOtp
};
