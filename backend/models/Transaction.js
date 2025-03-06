const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi'],
    required: true
  },
  paymentDetails: {
    cardBrand: String,
    last4: String,
    upiId: String
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    required: true
  },
  receiptUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);