const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  try {
    const { amount, plan, billingCycle, userId } = req.body;

    const user = await User.findById(userId);
    const isUpgrade = user.subscription.plan !== 'free' && user.subscription.status === 'active';
    const previousPlan = user.subscription.plan;

    const pendingTransaction = await Transaction.findOne({
      userId: userId,
      status: { $in: ['created', 'authorized', 'pending'] },
      'subscriptionDetails.plan': plan,
      'subscriptionDetails.billingCycle': billingCycle
    });

    if (pendingTransaction) {
      return res.status(400).json({ 
        error: 'There is already a pending payment for this plan',
        pendingOrderId: pendingTransaction.orderId
      });
    }
      const options = {
          amount: req.body.amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `order_rcptid_${Date.now()}`,
          notes: {
            userId: userId,
            plan: plan,
            billingCycle: billingCycle,
            isUpgrade: isUpgrade,
            previousPlan: previousPlan
          }
      };
      const order = await razorpay.orders.create(options);

      const transaction =await Transaction.create({
        userId: userId,
        orderId: order.id,
        amount: amount,
        currency: 'INR',
        status: 'created',
        subscriptionDetails: {
          plan: plan,
          billingCycle: billingCycle,
          isUpgrade: isUpgrade,
          previousPlan: previousPlan
        },
        notes: options.notes
      });

      res.json({
        order: order,
        transactionId: transaction._id 
    });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;
    
    
    const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
    if (!transaction) {
      return res.status(404).json({ status: 'failed', message: 'Order not found' });
    }
    
   
    if (transaction.paymentId) {
      return res.status(400).json({ 
        status: 'duplicate', 
        message: 'This payment was already processed',
        transaction: transaction
      });
    }
    
    
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      
      
      transaction.paymentId = razorpay_payment_id;
      transaction.status = 'captured';
      transaction.paymentMethod = paymentDetails.method;
      transaction.updatedAt = new Date();
      await transaction.save();
      
      const { plan, billingCycle, isUpgrade } = transaction.subscriptionDetails;
      const userId = transaction.userId;
      
      
      const startDate = new Date();
      let endDate = new Date(startDate);
      
      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (billingCycle === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      if (isUpgrade) {
        const user = await User.findById(userId);
        
        if (user.subscription.endDate > startDate) {
          
          const remainingTime = user.subscription.endDate - startDate;
          endDate = new Date(endDate.getTime() + remainingTime);
        }
      }
      
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'subscription.plan': plan,
            'subscription.billingCycle': billingCycle,
            'subscription.status': 'active',
            'subscription.startDate': startDate,
            'subscription.endDate': endDate,
            'subscription.autoRenew': true
          }
        },
        { new: true }
      );
      
      res.json({ 
        status: 'success', 
        message: 'Payment successful and subscription updated',
        user: updatedUser,
        transaction: transaction
      });
    } else {
     
      transaction.status = 'failed';
      transaction.updatedAt = new Date();
      await transaction.save();
      
      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
   
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(JSON.stringify(req.body));
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature === webhookSignature) {
      const event = req.body.event;
      const payload = req.body.payload.payment?.entity || req.body.payload.order?.entity;
      
      if (!payload) {
        return res.status(400).json({ status: 'invalid payload' });
      }
      
      const orderId = payload.order_id || payload.id;
      if (!orderId) {
        return res.status(400).json({ status: 'missing order ID' });
      }
      
      const transaction = await Transaction.findOne({ orderId: orderId });
      if (!transaction) {
        return res.status(404).json({ status: 'transaction not found' });
      }
      
      let newStatus;
      let paymentId;
      
      switch (event) {
        case 'payment.authorized':
          newStatus = 'authorized';
          paymentId = payload.id;
          break;
          
        case 'payment.captured':
          newStatus = 'captured';
          paymentId = payload.id;
          
          await updateSubscription(
            transaction.userId,
            transaction.subscriptionDetails.plan,
            transaction.subscriptionDetails.billingCycle,
            'active',
            transaction.subscriptionDetails.isUpgrade
          );
          break;
          
        case 'payment.failed':
          newStatus = 'failed';
          paymentId = payload.id;
          
          if (!transaction.subscriptionDetails.isUpgrade) {
            await updateSubscription(
              transaction.userId,
              transaction.subscriptionDetails.plan,
              transaction.subscriptionDetails.billingCycle,
              'past_due',
              false
            );
          }
          break;
          
        case 'payment.pending':
          newStatus = 'pending';
          paymentId = payload.id;
          break;
          
        case 'refund.created':
          newStatus = 'refunded';
          
          const user = await User.findById(transaction.userId);
          
          if (transaction.subscriptionDetails.isUpgrade && 
              transaction.subscriptionDetails.previousPlan !== 'free') {
            await updateSubscription(
              transaction.userId,
              transaction.subscriptionDetails.previousPlan,
              user.subscription.billingCycle,
              'active',
              false
            );
          } else {
            await User.findByIdAndUpdate(
              transaction.userId,
              { $set: { 'subscription.status': 'inactive' } }
            );
          }
          break;
      }
      
      if (newStatus) {
        transaction.status = newStatus;
        if (paymentId) transaction.paymentId = paymentId;
        transaction.updatedAt = new Date();
        await transaction.save();
      }
      
      res.json({ status: 'webhook processed' });
    } else {
      res.status(400).json({ status: 'invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

async function updateSubscription(userId, plan, billingCycle, status, isUpgrade = false) {
  try {
    const user = await User.findById(userId);
    
    const startDate = new Date();
    let endDate = new Date(startDate);
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'annual') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
   
    if (isUpgrade && status === 'active' && user.subscription.endDate > startDate) {
      
      const remainingTime = user.subscription.endDate - startDate;
      endDate = new Date(endDate.getTime() + remainingTime);
    }
    
    const subscription = {
      'subscription.plan': plan,
      'subscription.billingCycle': billingCycle,
      'subscription.status': status
    };
    
    
    if (status === 'active') {
      subscription['subscription.startDate'] = startDate;
      subscription['subscription.endDate'] = endDate;
    }
    
    await User.findByIdAndUpdate(
      userId,
      { $set: subscription },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

// router.post('/retry-payment', async (req, res) => {
//   try {
//     const { transactionId } = req.body;
    
//     const failedTransaction = await Transaction.findById(transactionId);
    
//     if (!failedTransaction || !['failed', 'pending'].includes(failedTransaction.status)) {
//       return res.status(400).json({ 
//         error: 'Invalid transaction or transaction is not in a failed/pending state' 
//       });
//     }
    
    
//     const options = {
//       amount: failedTransaction.amount * 100, 
//       currency: failedTransaction.currency,
//       receipt: `retry_${Date.now()}`,
//       notes: failedTransaction.notes
//     };
    
//     const order = await razorpay.orders.create(options);
    
//     await Transaction.create({
//       userId: failedTransaction.userId,
//       orderId: order.id,
//       amount: failedTransaction.amount,
//       currency: failedTransaction.currency,
//       status: 'created',
//       subscriptionDetails: failedTransaction.subscriptionDetails,
//       notes: failedTransaction.notes
//     });
    
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/cancel-pending-order', async (req, res) => {
  try {
      const { userId, plan, billingCycle } = req.body;

      if (!userId || !plan || !billingCycle) {
          return res.status(400).json({ error: 'Missing parameters: userId, plan, and billingCycle are required.' });
      }

      const pendingTransaction = await Transaction.findOne({
          userId: userId,
          status: { $in: ['created', 'authorized', 'pending'] },
          'subscriptionDetails.plan': plan,
          'subscriptionDetails.billingCycle': billingCycle
      });

      if (!pendingTransaction) {
          return res.status(404).json({ message: "No pending order found for this plan." });
      }

      pendingTransaction.status = 'cancelled';
      pendingTransaction.updatedAt = new Date();
      await pendingTransaction.save();

      res.json({ status: 'success', message: "Pending payment cancelled successfully." });

  } catch (error) {
      console.error("Error cancelling pending order:", error);
      res.status(500).json({ status: 'error', message: "Failed to cancel pending order.", error: error.message });
  }
});

router.get('/subscription-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await Transaction.find({ 
      userId: userId 
    }).sort({ createdAt: -1 });
    
    const user = await User.findById(userId, 'subscription');
    
    res.json({
      subscription: user.subscription,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;