const mongoose = require('mongoose');

const ACTIVE_HOURS_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\+?[1-9]\d{7,14}$/
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: EMAIL_REGEX
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    partnerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 4,
      maxlength: 30
    },
    zone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
      index: true
    },
    upiId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/
    },
    activeHours: {
      start: {
        type: String,
        required: true,
        match: ACTIVE_HOURS_REGEX
      },
      end: {
        type: String,
        required: true,
        match: ACTIVE_HOURS_REGEX
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);



module.exports = mongoose.model('Worker', workerSchema);
