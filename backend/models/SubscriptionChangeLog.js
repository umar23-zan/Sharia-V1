const mongoose = require('mongoose');

const SubscriptionChangeLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromPlan: {
    type: String,
    enum: ['basic', 'premium', null],
    required: true
  },
  toPlan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  fromBillingCycle: {
    type: String,
    enum: ['monthly', 'annual', null],
    required: true
  },
  toBillingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    required: true
  },
  changeDate: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    enum: ['upgrade', 'downgrade', 'renewal', 'other'],
    default: 'other'
  },
  notes: String
});

module.exports = mongoose.model('SubscriptionChangeLog', SubscriptionChangeLogSchema);