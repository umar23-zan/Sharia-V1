const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: String, 
  },
  subscriptionId: String, 
  paymentId: { 
    type: String 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  status: { 
    type: String, 
    enum: ['created', 'authorized', 'captured', 'failed', 'pending', 'refunded', 'cancelled', 'halted', 'active', 'duplicate'],
    default: 'created' 
  },
  paymentMethod: { 
    type: String 
  },
  subscriptionDetails: {
    plan: { 
      type: String, 
      enum: ['free', 'basic', 'premium'] 
    },
    billingCycle: { 
      type: String, 
      enum: ['monthly', 'annual'] 
    },
    isUpgrade: { 
      type: Boolean,
      default: false 
    },
    previousPlan: { 
      type: String 
    },
    paymentMode: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
    isRenewal: Boolean
  },
  paymentLinkId: String,
  notes: { 
    type: Object 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;