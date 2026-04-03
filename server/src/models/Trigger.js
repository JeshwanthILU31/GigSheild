const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['RAIN', 'AQI', 'HEAT', 'PLATFORM_DOWN']
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
      index: true
    },
    threshold: {
      type: Number,
      required: true
    },
    actualValue: {
      type: Number,
      required: true
    },
    affectedWorkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
      }
    ]
  },
  {
    timestamps: true
  }
);

triggerSchema.index({ type: 1, pinCode: 1, createdAt: -1 });

module.exports = mongoose.model('Trigger', triggerSchema);
