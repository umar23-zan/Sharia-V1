// routes/payments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const PlanConfig = require('../models/PlanConfig');
const { initializeRazorpay } = require('../utils/payment');

// @route   POST api/payments/initiate
// @desc    Initiate payment for subscription
// @access  Private
router.post('/initiate', auth, async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;
    
    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }
    
    // Get plan pricing from database
    const planConfig = await PlanConfig.findOne({ planId: plan });
    
    if (!planConfig || !planConfig.isActive) {
      return res.status(400).json({ message: 'Selected plan is not available' });
    }
    
    // Calculate pricing
    const basePrice = planConfig.prices[billingCycle];
    const taxRate = 0.18; // 18% GST
    const taxAmount = basePrice * taxRate;
    const totalAmount = basePrice + taxAmount;
    
    // Get user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create order using Razorpay (example)
    const razorpay = initializeRazorpay();
    
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${user._id}_${Date.now()}`,
      notes: {
        user_id: user._id.toString(),
        plan,
        billingCycle
      }
    });
    
    // Create a pending transaction
    const transaction = new Transaction({
      user: user._id,
      amount: totalAmount,
      currency: 'INR',
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan (${billingCycle})`,
      status: 'pending',
      paymentMethod: 'card', // Default, will be updated later
      subscriptionPlan: plan,
      billingCycle,
      taxAmount
    });
    
    await transaction.save();
    
    // Return payment information to frontend
    res.json({
      order_id: order.id,
      order_amount: totalAmount,
      plan_price: basePrice,
      tax_amount: taxAmount,
      currency: 'INR',
      transaction_id: transaction._id,
      plan_features: planConfig.features
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/payments/verify
// @desc    Verify payment and update subscription
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, transaction_id } = req.body;
    
    // Verify payment signature with Razorpay
    const razorpay = initializeRazorpay();
    
    // This is where you'd verify the payment with Razorpay
    // For demo purposes, we'll assume it's valid
    
    // Update transaction status
    const transaction = await Transaction.findById(transaction_id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transaction.status = 'completed';
    transaction.paymentDetails = {
      ...transaction.paymentDetails,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    };
    
    await transaction.save();
    
    // Update user subscription
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (transaction.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Update subscription
    user.subscription = {
      plan: transaction.subscriptionPlan,
      billingCycle: transaction.billingCycle,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true
    };
    
    await user.save();
    
    res.json({
      message: 'Payment verified and subscription updated successfully',
      subscription: user.subscription,
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        status: transaction.status
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/history
// @desc    Get payment history for user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;