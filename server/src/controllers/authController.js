const {
  registerWorker,
  verifyWorkerOtp,
  resendWorkerOtp,
  loginWorker
} = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await registerWorker(req.body);

    const response = {
      success: true,
      message: 'Registration successful. Verify OTP to activate account',
      data: {
        workerId: result.workerId,
        email: result.email,
        phone: result.phone
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      response.otp = result.otp;
    }

    return res.status(201).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const result = await verifyWorkerOtp(req.body);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'OTP verification failed'
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const result = await resendWorkerOtp(req.body);

    const response = {
      success: true,
      message: 'OTP resent successfully',
      data: {
        email: result.email
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      response.data.otp = result.otp;
    }

    return res.status(200).json(response);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'OTP resend failed'
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginWorker(req.body);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login
};
