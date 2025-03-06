const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { v4: uuidv4 } = require("uuid");

const dummyCard = {
  cardNumber: "4242 4242 4242 4242",
  expiry: "12/34",
  cvv: "123",
};

// Check subscription status before initiating
router.post("/initiate", async (req, res) => {
  const { userId, plan, amount, billingCycle } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check user's current subscription status
    if (user.subscription && user.subscription.status === 'active') {
      const currentPlan = user.subscription.plan;
      const currentCycle = user.subscription.billingCycle;
      const endDate = new Date(user.subscription.endDate);
      
      // Format the date in a readable format
      const formattedEndDate = endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // If trying to subscribe to the same plan with same billing cycle
      if (currentPlan === plan && currentCycle === billingCycle) {
        return res.status(400).json({ 
          error: "Subscription already active",
          currentPlan,
          endDate: formattedEndDate,
          message: `You already have an active ${currentPlan} subscription on a ${currentCycle} cycle, valid until ${formattedEndDate}.`
        });
      }
      
      // If trying to subscribe to a different plan or cycle, allow upgrade/downgrade
      return res.status(200).json({
        status: 'upgrade_available',
        currentPlan,
        currentCycle,
        endDate: formattedEndDate,
        message: `You currently have an active ${currentPlan} ${currentCycle} plan. Proceeding will change your subscription.`
      });
    }
    
    // Check for existing pending transactions
    const pendingTransaction = await Transaction.findOne({
      user: userId,
      status: 'pending'
    });
    
    if (pendingTransaction) {
      // Return existing pending transaction
      return res.json({
        transactionId: pendingTransaction.transactionId,
        status: 'pending',
        message: 'Pending transaction found',
        plan: pendingTransaction.subscriptionPlan,
        amount: pendingTransaction.amount,
        billingCycle: pendingTransaction.billingCycle
      });
    }
    
    // Create new pending transaction
    const transactionId = uuidv4();
    const newTransaction = new Transaction({
      transactionId,
      user: user._id,
      subscriptionPlan: plan,
      amount,
      status: "pending",
      paymentMethod: "card", // Default, will be updated when payment completes
      billingCycle,
    });
    
    await newTransaction.save();
    
    res.json({ 
      transactionId, 
      status: 'pending',
      message: 'Transaction initiated successfully' 
    });
  } catch (error) {
    console.error("Error initiating transaction:", error);
    res.status(500).json({ error: "Failed to initiate transaction" });
  }
});

// Complete subscription with payment details
router.post("/subscribe", async (req, res) => {
  const { userId, transactionId, cardDetails, isUpgrade } = req.body;

  // Validate card details (using dummy card for testing)
  if (
    cardDetails.cardNumber !== dummyCard.cardNumber ||
    cardDetails.expiry !== dummyCard.expiry ||
    cardDetails.cvv !== dummyCard.cvv
  ) {
    return res.status(400).json({ error: "Invalid card details" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the pending transaction
    const transaction = await Transaction.findOne({ 
      transactionId: transactionId,
      user: userId
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        error: "Transaction is already processed",
        status: transaction.status 
      });
    }

    // If user has an active subscription and not explicitly upgrading/changing
    if (user.subscription && user.subscription.status === 'active' && !isUpgrade) {
      return res.status(400).json({ 
        error: "Subscription already active. Please confirm upgrade/change."
      });
    }

    // If this is an upgrade/change, record the previous plan info
    let previousSubscription = null;
    if (user.subscription && user.subscription.status === 'active') {
      previousSubscription = { ...user.subscription };
      
      // Create a record of the plan change
      const changeLog = new SubscriptionChangeLog({
        user: user._id,
        fromPlan: previousSubscription.plan,
        toPlan: transaction.subscriptionPlan,
        fromBillingCycle: previousSubscription.billingCycle,
        toBillingCycle: transaction.billingCycle,
        changeDate: new Date()
      });
      await changeLog.save();
    }

    // Update transaction status
    const startDate = new Date();
    const expiryDate = new Date();
    if (transaction.billingCycle === "annual") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    transaction.status = "completed";
    transaction.paymentDetails = {
      cardBrand: "Visa",
      last4: "4242",
    };
    transaction.previousSubscription = previousSubscription;
    await transaction.save();

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      subscription: { 
        plan: transaction.subscriptionPlan, 
        status: "active", 
        billingCycle: transaction.billingCycle, 
        startDate, 
        endDate: expiryDate 
      },
      stockSearchCount: 0, // Reset search count with new subscription
    });

    const responseMessage = previousSubscription 
      ? "Subscription changed successfully" 
      : "Subscription activated successfully";

    res.json({ 
      message: responseMessage, 
      transactionId,
      plan: transaction.subscriptionPlan,
      billingCycle: transaction.billingCycle,
      endDate: expiryDate,
      isUpgrade: !!previousSubscription
    });

  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
});

// Get user's subscription status
router.get("/subscription-status/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.subscription || user.subscription.status !== 'active') {
      return res.json({
        hasActiveSubscription: false
      });
    }
    
    const endDate = new Date(user.subscription.endDate);
    const formattedEndDate = endDate.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    res.json({
      hasActiveSubscription: true,
      plan: user.subscription.plan,
      billingCycle: user.subscription.billingCycle,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      formattedEndDate,
      daysRemaining: Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
});

// Get pending transaction for a user
router.get("/pending/:userId", async (req, res) => {
  try {
    const pendingTransaction = await Transaction.findOne({
      user: req.params.userId,
      status: 'pending'
    });
    
    if (!pendingTransaction) {
      return res.status(404).json({ message: "No pending transactions found" });
    }
    
    res.json({
      transactionId: pendingTransaction.transactionId,
      plan: pendingTransaction.subscriptionPlan,
      amount: pendingTransaction.amount,
      billingCycle: pendingTransaction.billingCycle,
      createdAt: pendingTransaction.createdAt
    });
    
  } catch (error) {
    console.error("Error fetching pending transaction:", error);
    res.status(500).json({ error: "Failed to fetch pending transaction" });
  }
});

// Cancel a pending transaction
router.post("/cancel/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      transactionId: req.params.transactionId 
    });
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        error: "Cannot cancel a non-pending transaction" 
      });
    }
    
    transaction.status = "failed";
    await transaction.save();
    
    res.json({ message: "Transaction cancelled successfully" });
    
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    res.status(500).json({ error: "Failed to cancel transaction" });
  }
});

module.exports = router;