const nodemailer = require('nodemailer');

let transporter;

const createTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    const error = new Error('EMAIL_USER and EMAIL_PASS must be configured');
    error.statusCode = 500;
    throw error;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  return transporter;
};

const sendOtpEmail = async (email, otp) => {
  try {
    const mailTransporter = createTransporter();

    await mailTransporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'GigShield verification OTP',
      text: `Your GigShield verification OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
          <h2 style="margin-bottom: 12px;">GigShield Verification</h2>
          <p>Your OTP is:</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    const sendError = new Error('Failed to send OTP email');
    sendError.statusCode = 500;
    sendError.cause = error;
    throw sendError;
  }
};

module.exports = {
  sendOtpEmail
};
