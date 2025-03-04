const mongoose = require('mongoose');

const PlanConfigSchema = new mongoose.Schema({
  planId: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  prices: {
    monthly: {
      type: Number,
      required: true
    },
    annual: {
      type: Number,
      required: true
    }
  },
  features: [String],
  limits: {
    stockSearch: Number,
    stockStorage: Number,
    historyMonths: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlanConfig', PlanConfigSchema);