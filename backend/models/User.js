const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: {
        type: String,
        sparse: true
      },
      isVerified: { 
        type: Boolean,
        default: false
    },
    verificationToken: { 
        type: String,
        default: null
    },
    contactNumber: { type: String },
    doorNumber: { type: String },        
    streetName: { type: String },
    city: { type: String },
    country: { type: String },
    pincode: { type: String },
    profilePicture: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    searchedStocks: [{ type: String }],
    watchlist: [{ 
      symbol: { type: String, required: true },
      companyName: { type: String, required: true },
      stockData: { type: Object, required: true }
  }],
  razorpayCustomerId: { type: String, index: true },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'annual', ''],
        default: ''
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'past_due', 'cancelled', 'expired', 'cancelling'],
        default: 'inactive'
      },
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: {
        type: Date
      },
      autoRenew: {
        type: Boolean,
        default: true
      },
      subscriptionId: { type: String, index: true },
      orderId: { type: String, index: true },   
      paymentReminderSent: { type: Boolean, default: false },
      firstReminderSent: {
        type: Boolean,
        default: false
      },
      secondReminderSent: {
        type: Boolean,
        default: false
      },
      finalReminderSent: {
        type: Boolean,
        default: false
      },
      subscriptionId: String, 
      paymentMethodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod'
      },
      paymentMode: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
      pendingPaymentMode: { type: String},
      paymentModeChangeDate: {type: Date},
      nextPaymentDue: { type: Date },
      lastPaymentDate: Date, 
      lastPaymentId: String,
      lastPaymentReminder: { type: Date },
      cancellationReason: String,
      cancellationFeedback: String,
      cancelledAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});
UserSchema.pre('updateMany', function(next) { 
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('User', UserSchema);
