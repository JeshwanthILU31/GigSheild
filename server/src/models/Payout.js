const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      required: true,
      unique: true,
      index: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    upiId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/
    },
    razorpayRef: {
      type: String,
      trim: true,
      index: true,
      sparse: true
    },
    status: {
      type: String,
      required: true,
      enum: ['INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED'],
      default: 'INITIATED'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    timestamps: true
  }
);

payoutSchema.index({ workerId: 1, timestamp: -1 });
payoutSchema.index({ status: 1, timestamp: -1 });

module.exports = mongoose.model('Payout', payoutSchema);
