const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  classification: {
    type: String,
    enum: ['HARAM', 'UNCERTAIN', 'UNDER REVIEW'],
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  reason: {
    type: String
  },
  key_violations: [{
    type: String
  }],
  articleUrl: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);