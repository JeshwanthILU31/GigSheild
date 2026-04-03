const bcrypt = require('bcryptjs');
const Worker = require('../models/Worker');
const { generateToken } = require('../utils/jwt');
const { generateOtp, setOtp, verifyOtp } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/email');

const registerWorker = async (payload) => {
  const {
    name,
    email,
    phone,
    password,
    partnerId,
    zone,
    pinCode,
    upiId,
    activeHours
  } = payload;

  const requiredFields = [
    'name',
    'email',
    'phone',
    'password',
    'partnerId',
    'zone',
    'pinCode',
    'upiId',
    'activeHours'
  ];

  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (
    activeHours &&
    (typeof activeHours !== 'object' || !activeHours.start || !activeHours.end)
  ) {
    const error = new Error('activeHours.start and activeHours.end are required');
    error.statusCode = 400;
    throw error;
  }

  if (missingFields.length > 0) {
    const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [existingPhoneWorker, existingEmailWorker] = await Promise.all([
    Worker.findOne({ phone }),
    Worker.findOne({ email: normalizedEmail })
  ]);

  if (existingPhoneWorker) {
    const error = new Error('Phone is already registered');
    error.statusCode = 409;
    throw error;
  }

  if (existingEmailWorker) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOtp();

  const worker = await Worker.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    partnerId,
    zone,
    pinCode,
    upiId,
    activeHours,
    isVerified: false
  });

  setOtp(normalizedEmail, otp);

  // TEMP: skip email sending during development
  if (process.env.NODE_ENV === 'production') {
    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      await Worker.deleteOne({ _id: worker._id });

      const emailError = new Error('Failed to send OTP email');
      emailError.statusCode = 500;
      throw emailError;
    }
  }

  return {
    workerId: worker._id,
    email: worker.email,
    phone: worker.phone,
    otp
  };
};

const verifyWorkerOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    const error = new Error('email and otp are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const worker = await Worker.findOne({ email: normalizedEmail });

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  const isValidOtp = verifyOtp(normalizedEmail, otp);

  if (!isValidOtp) {
    const error = new Error('Invalid or expired OTP');
    error.statusCode = 400;
    throw error;
  }

  worker.isVerified = true;
  await worker.save();

  const token = generateToken(worker._id);

  return {
    token,
    worker: {
      id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      isVerified: worker.isVerified
    }
  };
};

const resendWorkerOtp = async ({ email }) => {
  if (!email) {
    const error = new Error('email is required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const worker = await Worker.findOne({ email: normalizedEmail });

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  if (worker.isVerified) {
    const error = new Error('Worker is already verified');
    error.statusCode = 400;
    throw error;
  }

  const otp = generateOtp();
  setOtp(normalizedEmail, otp);

  if (process.env.NODE_ENV === 'production') {
    await sendOtpEmail(normalizedEmail, otp);
  }

  return {
    email: worker.email,
    otp
  };
};

const loginWorker = async ({ identifier, email, phone, password }) => {
  const loginIdentifier = identifier || email || phone;

  if (!loginIdentifier || !password) {
    const error = new Error('identifier and password are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedIdentifier =
    typeof loginIdentifier === 'string'
      ? loginIdentifier.trim()
      : loginIdentifier;

  const worker = await Worker.findOne({
    $or: [
      { email: String(normalizedIdentifier).toLowerCase() },
      { phone: normalizedIdentifier }
    ]
  }).select('+password');

  if (!worker) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, worker.password);

  if (!isPasswordMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (!worker.isVerified) {
    const error = new Error('Worker is not verified. Please verify OTP first');
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(worker._id);

  return {
    token,
    worker: {
      id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      isVerified: worker.isVerified
    }
  };
};

module.exports = {
  registerWorker,
  verifyWorkerOtp,
  resendWorkerOtp,
  loginWorker
};
