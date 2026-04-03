const mongoose = require('mongoose');

const fraudFlagSchema = new mongoose.Schema(
  {
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    llmReasoning: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    resolvedBy: {
      type: String,
      trim: true,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

fraudFlagSchema.index({ claimId: 1, resolvedAt: 1 });

module.exports = mongoose.model('FraudFlag', fraudFlagSchema);
