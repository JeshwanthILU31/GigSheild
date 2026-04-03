const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
      index: true
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
      index: true
    },
    triggerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trigger',
      index: true
    },
    disruptionType: {
      type: String,
      trim: true,
      default: null
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    estimatedPayout: {
      type: Number,
      required: true,
      min: 0
    },
    payoutAmount: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'],
      default: 'PENDING'
    },
    fraudScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    llmVerdict: {
      type: String,
      enum: ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK', 'REVIEW_REQUIRED'],
      default: 'REVIEW_REQUIRED'
    }
  },
  {
    timestamps: true
  }
);

claimSchema.index({ status: 1, createdAt: -1 });
claimSchema.index({ workerId: 1, policyId: 1, createdAt: -1 });

module.exports = mongoose.model('Claim', claimSchema);
