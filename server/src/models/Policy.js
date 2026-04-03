const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
      index: true
    },
    weeklyPremium: {
      type: Number,
      required: true,
      min: 0
    },
    premiumTier: {
      type: String,
      required: true,
      enum: ['BASIC', 'STANDARD', 'PREMIUM']
    },
    coverageCap: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'LAPSED', 'CANCELLED', 'EXPIRED'],
      default: 'PENDING'
    },
    renewalDate: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Policy', policySchema);
