const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  cardNetwork: String,
  cardLast4: String,
  cardExpiryMonth: String,
  cardExpiryYear: String,
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);