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
    contactNumber: { type: String },
    doorNumber: { type: String },        
    streetName: { type: String },
    city: { type: String },
    country: { type: String },
    pincode: { type: String },
    profilePicture: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    stockSearchCount: { type: Number, default: 0 }, 
    lastSearchedSymbol: { type: String, default: null },
    watchlist: [{ 
      symbol: { type: String, required: true },
      companyName: { type: String, required: true },
      stockData: { type: Object, required: true }
  }],
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'past_due', 'canceled'],
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
      }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});




module.exports = mongoose.model('User', UserSchema);
