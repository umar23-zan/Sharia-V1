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
    stockResultsViewsCount: { type: Number, default: 0 }, 
    viewedStockIds: { type: [String], default: [] }, 
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
        default: 'active'
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
    savedStocks: [{
      symbol: String,
      name: String,
      dateAdded: {
        type: Date,
        default: Date.now
      }
    }],
});

UserSchema.methods.hasReachedStockLimit = function() {
  const limits = {
    free: 0,
    basic: 10,
    premium: 50
  };
  
  return this.savedStocks.length >= limits[this.subscription.plan];
};


module.exports = mongoose.model('User', UserSchema);
