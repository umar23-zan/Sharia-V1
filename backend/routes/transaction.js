const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const PaymentMethod = require('../models/PaymentMethods')
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendEmail } = require('../service/emailService')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const getPlanId = (plan, billingCycle) => {
  
  const planMapping = {
    basic: {
      monthly: 'plan_QCsQzgSogc37NP', 
      annual: 'plan_QCsSF56STadNOW' 
    },
    premium: {
      monthly: 'plan_QCsUQ7ahSqZ8Oy', 
      annual: 'plan_QCsTdvd0K6Uyc9'  
    }
  };

  const billingCycleKey = billingCycle === 'monthly' ? 'monthly' : 'annual';
  
  if (!planMapping[plan] || !planMapping[plan][billingCycleKey]) {
    throw new Error(`Plan ID not found for ${plan} - ${billingCycle}`);
  }
  
  return planMapping[plan][billingCycleKey];
};

router.post('/create-subscription', async (req, res) => {
  // ... (keep existing code)
  try {
    const {plan, billingCycle, userId, paymentMode} = req.body;
    console.log("selectedPlan:", plan);
    console.log("billingCycle:", billingCycle);
    console.log("userId:", userId);
    console.log("paymentMode:", paymentMode);

    if (!['automatic', 'manual'].includes(paymentMode)) {
      return res.status(400).json({ error: 'Invalid payment mode. Must be automatic or manual' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isUpgrade = user.subscription.plan !== 'free' && user.subscription.status === 'active';
    const previousPlan = user.subscription.plan;

    // Check for pending transactions
    const pendingTransactionQuery = {
      userId: userId,
      status: { $in: ['created', 'authorized', 'pending'] },
      'subscriptionDetails.plan': plan,
      'subscriptionDetails.billingCycle': billingCycle
    };

    const pendingTransaction = await Transaction.findOne(pendingTransactionQuery);

    if (pendingTransaction) {
      const pendingId = paymentMode === 'automatic' ?
        pendingTransaction.subscriptionId :
        pendingTransaction.orderId;

      return res.status(400).json({
        error: 'There is already a pending payment for this plan',
        pendingId: pendingId
      });
    }

    // Set amount based on plan and billing cycle
    let amount;
    if (plan === 'basic') {
      amount = billingCycle === 'monthly' ? 352.82 : 3596.64;
    } else if (plan === 'premium') {
      amount = billingCycle === 'monthly' ? 706.82 : 7209.80;
    } else {
         return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const notes = {
      userId: userId,
      plan: plan,
      billingCycle: billingCycle,
      isUpgrade: isUpgrade,
      previousPlan: previousPlan,
      paymentMode: paymentMode
    };

    let transaction;

    if (paymentMode === 'automatic') {
      // Create subscription for automatic payments
      const planId = getPlanId(plan, billingCycle);
      const subscriptionOptions = {
        plan_id: planId,
        total_count: billingCycle === 'monthly' ? 12 : 1, // Example: 12 cycles for monthly, 1 for annual
        quantity: 1,
        customer_notify: 0, // Disable Razorpay notifications if you send your own
        notes: notes
      };

      const subscription = await razorpay.subscriptions.create(subscriptionOptions);

      transaction = await Transaction.create({
        userId: userId,
        subscriptionId: subscription.id,
        amount: amount,
        currency: 'INR',
        status: 'created',
        subscriptionDetails: {
          plan: plan,
          billingCycle: billingCycle,
          isUpgrade: isUpgrade,
          previousPlan: previousPlan,
          paymentMode: paymentMode
        },
        notes: notes
      });

      res.json({
        subscription: subscription,
        transactionId: transaction._id
      });

    } else { // Manual payment mode
      // Create order for manual payments
      const orderOptions = {
        amount: Math.round(amount * 100), // Amount in paise, ensure it's an integer
        currency: 'INR',
        receipt: `order_rcpt_${Date.now()}_${userId}`, // More unique receipt
        notes: notes,
      };

      const order = await razorpay.orders.create(orderOptions);

      transaction = await Transaction.create({
        userId: userId,
        orderId: order.id,
        amount: amount,
        currency: 'INR',
        status: 'created',
        subscriptionDetails: {
          plan: plan,
          billingCycle: billingCycle,
          isUpgrade: isUpgrade,
          previousPlan: previousPlan,
          paymentMode: paymentMode
        },
        notes: notes
      });

      res.json({
        order: order,
        transactionId: transaction._id
      });
    }
  } catch (error) {
    console.error("Create subscription/order error:", error);
    res.status(500).json({ error: error.message, stack: error.stack }); // Include stack in dev?
  }
});

router.post('/verify-subscription', async (req, res) => {
  try {
    const {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
      save_payment_method
    } = req.body;

    const transaction = await Transaction.findOne({ subscriptionId: razorpay_subscription_id });
    if (!transaction) {
      console.error(`Verification Error: Transaction not found for subscription ID: ${razorpay_subscription_id}`);
      return res.status(404).json({ status: 'failed', message: 'Subscription transaction not found' });
    }

    // Check for duplicate processing more robustly
    if (transaction.status === 'captured' && transaction.paymentId === razorpay_payment_id) {
       console.log(`Duplicate verification attempt for subscription ${razorpay_subscription_id}, payment ${razorpay_payment_id}`);
       // Optionally fetch the user data again to send consistent response
       const currentUser = await User.findById(transaction.userId);
       return res.status(400).json({
        status: 'duplicate',
        message: 'This payment was already processed successfully',
        user: currentUser, // Send current user state
        transaction: transaction
      });
    }
     if (transaction.status === 'captured') {
         console.warn(`Verification attempt for already captured subscription ${razorpay_subscription_id} with a DIFFERENT payment ID (${razorpay_payment_id}). Original payment ID: ${transaction.paymentId}`);
         // Decide how to handle this - maybe reject, maybe log extensively. Rejecting is safer.
         return res.status(400).json({
             status: 'failed',
             message: 'Subscription is already active, possibly from a different payment.',
             transaction: transaction
         });
     }


    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_payment_id + '|' + razorpay_subscription_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Fetch payment details *before* marking as captured locally
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') { // Or just 'captured' depending on flow
            console.error(`Payment ${razorpay_payment_id} status is not 'captured' or 'authorized'. Status: ${paymentDetails.status}`);
             transaction.status = 'failed'; 
             transaction.updatedAt = new Date();
             await transaction.save();
            return res.status(400).json({ status: 'failed', message: `Payment status is ${paymentDetails.status}` });
      }

      // Update transaction record
      transaction.paymentId = razorpay_payment_id;
      transaction.status = 'captured'; // Mark as captured
      transaction.paymentMethod = paymentDetails.method;
      transaction.updatedAt = new Date();
      // Add more payment details if needed
      transaction.paymentDetails = {
          method: paymentDetails.method,
          card_id: paymentDetails.card_id,
          bank: paymentDetails.bank,
          wallet: paymentDetails.wallet,
          vpa: paymentDetails.vpa,
          //... any other relevant fields
      };
      await transaction.save();

      // --- Payment Method Saving Logic ---
      let savedPaymentMethod = null;
      let customerIdForToken = null; // Define outside the block

      // Fetch user to get potential existing razorpay_customer_id
       const userForPaymentMethod = await User.findById(transaction.userId);
       if (userForPaymentMethod && userForPaymentMethod.razorpayCustomerId) {
           customerIdForToken = userForPaymentMethod.razorpayCustomerId;
           console.log(`Using existing Razorpay Customer ID: ${customerIdForToken} for tokenization.`);
       } else {
            console.warn(`User ${transaction.userId} does not have a Razorpay Customer ID. Tokenization might be limited or fail without it.`);
       }


      if (save_payment_method && paymentDetails.method !== 'upi' && customerIdForToken) { // Only proceed if customer ID exists
        try {
          const tokenPayload = {
            payment_id: razorpay_payment_id,
            customer_id: customerIdForToken, // Use the fetched/created customer ID
           
          };

           const paymentMethodToken = paymentDetails.token_id; // Check if token_id exists on paymentDetails

            let paymentTokenIdToSave = null;

           if (paymentMethodToken) {
                console.log(`Token ${paymentMethodToken} already associated with payment ${razorpay_payment_id}`);
                 try {
                     const tokenDetails = await razorpay.customers.fetchToken(customerIdForToken, paymentMethodToken);
                     console.log("Fetched token details:", tokenDetails);
                     paymentTokenIdToSave = tokenDetails.id; // Use the fetched token ID
                 } catch(fetchTokenError) {
                      console.error(`Error fetching token ${paymentMethodToken} for customer ${customerIdForToken}:`, fetchTokenError);
                      // Fallback or error handling needed
                 }

           } else if (paymentDetails.method === 'card' && paymentDetails.card_id) {

                console.warn(`No direct token_id found on payment ${razorpay_payment_id}. Card ID ${paymentDetails.card_id} exists. Saving logic might need adjustment based on Razorpay token/card APIs.`);

           } else {
               console.log(`Payment method ${paymentDetails.method} used for payment ${razorpay_payment_id} does not seem to have an associated reusable token_id.`);
           }

            const paymentMethodInfo = {
                userId: transaction.userId,
                razorpayCustomerId: customerIdForToken, // Store the customer ID
                // tokenId: paymentTokenIdToSave, // Store the actual token ID if available
                method: paymentDetails.method,
                isDefault: true, // Make this new one the default
                // Add other useful details
                 status: 'active', // Or 'verified'
                 createdAt: new Date(),
                 updatedAt: new Date(),
            };

            // Add card-specific details if it's a card payment
            if (paymentDetails.method === 'card' && paymentDetails.card) {
                paymentMethodInfo.cardNetwork = paymentDetails.card.network;
                paymentMethodInfo.cardLast4 = paymentDetails.card.last4;
                paymentMethodInfo.cardIssuer = paymentDetails.card.issuer;
                paymentMethodInfo.cardType = paymentDetails.card.type;
            
                paymentMethodInfo.razorpayCardId = paymentDetails.card_id;
                // If we decided to use card_id as the primary identifier when token_id is absent:
                if (!paymentTokenIdToSave && paymentDetails.card_id) {
                     paymentMethodInfo.tokenId = paymentDetails.card_id; // Using card_id as identifier
                     console.log(`Using card_id ${paymentDetails.card_id} as the identifier for saved payment method.`);
                } else if (paymentTokenIdToSave) {
                    paymentMethodInfo.tokenId = paymentTokenIdToSave; // Use the found token ID
                }


            } else if (paymentDetails.method === 'netbanking') {
                 paymentMethodInfo.bank = paymentDetails.bank;
            }
            await PaymentMethod.updateMany(
                { userId: transaction.userId, isDefault: true },
                { $set: { isDefault: false, updatedAt: new Date() } }
            );

            // Save the new payment method
            savedPaymentMethod = await PaymentMethod.create(paymentMethodInfo);
            console.log('Saved new payment method:', savedPaymentMethod._id);

             // Update user's default payment method reference ONLY if successfully saved
             await User.findByIdAndUpdate(
               transaction.userId,
               { $set: { 'subscription.paymentMethodId': savedPaymentMethod._id } }
             );
          // } // End of 'if (paymentTokenIdToSave)' // Relaxed this condition

        } catch (tokenError) {
          console.error('Error saving payment method:', tokenError);
        }
      }


      const { plan, billingCycle, isUpgrade, paymentMode } = transaction.subscriptionDetails;
      const userId = transaction.userId;

      // Fetch user again to get the most recent data including email
      const user = await User.findById(userId);
      if (!user) {
         // This should ideally not happen if the transaction exists, but handle it.
         console.error(`User ${userId} not found after successful payment verification.`);
         // Don't throw, just prevent user update and email. Transaction is already saved.
         return res.status(500).json({ status: 'error', message: 'User not found after payment processing.' });
      }


      // Set subscription dates
      const startDate = new Date();
      let endDate = new Date(startDate);

      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (billingCycle === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      let proratedAdjustmentApplied = false; // Flag for email content
      if (isUpgrade && user.subscription.endDate && user.subscription.endDate > startDate) {
          // Simple proration: Add remaining time from the *previous active* subscription end date
          const remainingTime = user.subscription.endDate.getTime() - startDate.getTime();
          if (remainingTime > 0) {
              endDate = new Date(endDate.getTime() + remainingTime);
              proratedAdjustmentApplied = true;
              console.log(`Upgrade detected. Added ${remainingTime / (1000 * 60 * 60 * 24)} days. New end date: ${endDate}`);
           }
      }

       // Calculate next payment due date (relevant for display, reminders, and potential auto-charge attempts)
       // For automatic subscriptions, this is effectively the endDate.
       const nextPaymentDate = new Date(endDate);


      // Update user subscription details in DB
      const updatePayload = {
        $set: {
          'subscription.plan': plan,
          'subscription.billingCycle': billingCycle,
          'subscription.status': 'active', // Set to active
          'subscription.startDate': startDate,
          'subscription.endDate': endDate,
          'subscription.autoRenew': true, // Automatic subscription
          'subscription.subscriptionId': razorpay_subscription_id, // Link to Razorpay subscription
          'subscription.paymentMode': paymentMode || 'automatic', // Ensure it's set
          'subscription.nextPaymentDue': nextPaymentDate, // Date of next expected charge
          'subscription.paymentReminderSent': false, // Reset reminder flag
          'subscription.lastPaymentDate': startDate, // Record date of this successful payment
          'subscription.lastPaymentId': razorpay_payment_id, // Record the payment ID
           // If a payment method was saved, link it. Otherwise, keep the existing one or leave it null.
          ...(savedPaymentMethod && { 'subscription.paymentMethodId': savedPaymentMethod._id }),
        }
      };

      const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });

      // --- Send Confirmation Email ---
      if (updatedUser && updatedUser.email) {
        const subject = `Your ${plan.toUpperCase()} Subscription is Active!`;
        const html = `
          <h1>Subscription Activated!</h1>
          <p>Hello ${user.name || 'User'},</p>
          <p>Your payment for the <strong>${plan} (${billingCycle})</strong> subscription was successful.</p>
          <ul>
            <li>Plan: ${plan}</li>
            <li>Billing Cycle: ${billingCycle}</li>
            <li>Start Date: ${startDate.toLocaleDateString()}</li>
            <li>End Date: ${endDate.toLocaleDateString()}</li>
            <li>Next Payment Date: ${nextPaymentDate.toLocaleDateString()}</li>
            <li>Payment ID: ${razorpay_payment_id}</li>
            <li>Subscription ID: ${razorpay_subscription_id}</li>
            ${proratedAdjustmentApplied ? '<li>Your new end date includes remaining time from your previous plan.</li>' : ''}
            ${savedPaymentMethod ? `<li>Your payment method (${paymentDetails.method} ending in ${savedPaymentMethod.cardLast4 || ''}) has been saved for automatic renewals.</li>` : '<li>Your subscription will automatically renew using the payment method on file.</li>'}
          </ul>
          <p>Thank you for subscribing!</p>
        `;
        await sendEmail(updatedUser.email, subject, html);
      } else {
        console.warn(`Could not send confirmation email: User ${userId} not found or has no email address.`);
      }
      // --- End Send Email ---

      res.json({
        status: 'success',
        message: 'Payment successful and subscription updated',
        user: updatedUser,
        transaction: transaction // Send back the updated transaction
      });

    } else {
      // Invalid signature
      console.error(`Invalid signature for subscription ${razorpay_subscription_id}. Generated: ${generatedSignature}, Received: ${razorpay_signature}`);
      transaction.status = 'failed';
      transaction.notes.failure_reason = 'Invalid signature'; // Add failure reason
      transaction.updatedAt = new Date();
      await transaction.save();

      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (error) {
     console.error("Verify subscription error:", error);
     // Attempt to update transaction status to failed if an unexpected error occurs
     if (req.body.razorpay_subscription_id) {
         try {
             await Transaction.findOneAndUpdate(
                 { subscriptionId: req.body.razorpay_subscription_id, status: { $ne: 'captured' } }, // Avoid overwriting success
                 { $set: { status: 'failed', 'notes.failure_reason': 'Verification process error: ' + error.message, updatedAt: new Date() } }
             );
         } catch (dbError) {
             console.error("Failed to update transaction status on error:", dbError);
         }
     }
    res.status(500).json({ status: 'error', message: error.message, stack: error.stack }); // Include stack in dev?
  }
});


router.post('/verify-order', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // save_payment_method // Saving method usually not applicable/useful for one-time orders unless intended for future use
    } = req.body;

    const transaction = await Transaction.findOne({ orderId: razorpay_order_id });
    if (!transaction) {
       console.error(`Verification Error: Transaction not found for order ID: ${razorpay_order_id}`);
      return res.status(404).json({ status: 'failed', message: 'Order transaction not found' });
    }

     // Check for duplicate processing
     if (transaction.status === 'captured' && transaction.paymentId === razorpay_payment_id) {
        console.log(`Duplicate verification attempt for order ${razorpay_order_id}, payment ${razorpay_payment_id}`);
         const currentUser = await User.findById(transaction.userId);
        return res.status(400).json({
         status: 'duplicate',
         message: 'This payment was already processed successfully',
         user: currentUser,
         transaction: transaction
       });
     }
      if (transaction.status === 'captured') {
          console.warn(`Verification attempt for already captured order ${razorpay_order_id} with a DIFFERENT payment ID (${razorpay_payment_id}). Original payment ID: ${transaction.paymentId}`);
          return res.status(400).json({
              status: 'failed',
              message: 'Order is already marked as paid, possibly from a different payment.',
              transaction: transaction
          });
      }


    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
       // Fetch payment details *before* marking as captured
       const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
       if (paymentDetails.status !== 'captured') { // For orders, status must be 'captured'
            console.error(`Payment ${razorpay_payment_id} for order ${razorpay_order_id} is not 'captured'. Status: ${paymentDetails.status}`);
             transaction.status = 'failed'; // Or 'payment_failed'
             transaction.notes.failure_reason = `Payment status check failed: ${paymentDetails.status}`;
             transaction.updatedAt = new Date();
             await transaction.save();
            return res.status(400).json({ status: 'failed', message: `Payment status is ${paymentDetails.status}` });
       }
        // Ensure the payment amount matches the transaction amount (in paise)
        if (paymentDetails.amount !== Math.round(transaction.amount * 100)) {
            console.error(`Amount mismatch for order ${razorpay_order_id}. Expected: ${Math.round(transaction.amount * 100)}, Received: ${paymentDetails.amount}`);
            transaction.status = 'failed';
            transaction.notes.failure_reason = 'Amount mismatch';
            transaction.updatedAt = new Date();
            await transaction.save();
            return res.status(400).json({ status: 'failed', message: 'Payment amount mismatch' });
        }


      // Update transaction record
      transaction.paymentId = razorpay_payment_id;
      transaction.status = 'captured'; // Mark as captured
      transaction.paymentMethod = paymentDetails.method;
       transaction.paymentDetails = { // Store details
          method: paymentDetails.method,
          card_id: paymentDetails.card_id,
          bank: paymentDetails.bank,
          wallet: paymentDetails.wallet,
          vpa: paymentDetails.vpa,
           amount_paid: paymentDetails.amount / 100, // Store amount paid from payment object
           currency: paymentDetails.currency
      };
      transaction.updatedAt = new Date();
      await transaction.save();

      // Payment method saving logic could be added here if needed for future manual renewals
      // but it's less common for non-subscription orders. Follow similar logic as in /verify-subscription if required.

      const { plan, billingCycle, isUpgrade } = transaction.subscriptionDetails;
      const userId = transaction.userId;

      // Fetch user again to get email and current state
       const user = await User.findById(userId);
       if (!user) {
           console.error(`User ${userId} not found after successful order payment verification.`);
           return res.status(500).json({ status: 'error', message: 'User not found after payment processing.' });
       }


      // Set subscription dates for this manual period
      const startDate = new Date();
      let endDate = new Date(startDate);

      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (billingCycle === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

       let proratedAdjustmentApplied = false; // Flag for email content
       if (isUpgrade && user.subscription.endDate && user.subscription.endDate > startDate) {
           // Add remaining time from previous plan
           const remainingTime = user.subscription.endDate.getTime() - startDate.getTime();
            if (remainingTime > 0) {
               endDate = new Date(endDate.getTime() + remainingTime);
               proratedAdjustmentApplied = true;
                console.log(`Upgrade detected (manual). Added ${remainingTime / (1000 * 60 * 60 * 24)} days. New end date: ${endDate}`);
            }
       }


        // For manual payments, 'nextPaymentDue' is more like an 'expiry warning' date.
        // Setting multiple reminder flags can be useful.
       const firstReminderDate = new Date(endDate);
       firstReminderDate.setDate(firstReminderDate.getDate() - 7); // 7 days before expiry
       const secondReminderDate = new Date(endDate);
       secondReminderDate.setDate(secondReminderDate.getDate() - 3); // 3 days before expiry
       const finalReminderDate = new Date(endDate);
       finalReminderDate.setDate(finalReminderDate.getDate() - 1); // 1 day before expiry


      // Update user subscription details in DB
       const updatePayload = {
         $set: {
           'subscription.plan': plan,
           'subscription.billingCycle': billingCycle,
           'subscription.status': 'active', // Set to active
           'subscription.startDate': startDate,
           'subscription.endDate': endDate,
           'subscription.autoRenew': false, // Manual payment
           // 'subscription.subscriptionId': null, // Clear any old auto-renew subscription ID
           'subscription.orderId': razorpay_order_id, // Link to the successful order
           'subscription.paymentMode': 'manual', // Explicitly set to manual
            // Reset reminder flags for this new period
           'subscription.firstReminderSent': false,
           'subscription.secondReminderSent': false,
           'subscription.finalReminderSent': false,
            'subscription.lastPaymentDate': startDate,
           'subscription.lastPaymentId': razorpay_payment_id,
           // Optional: Clear paymentMethodId if it was linked to an auto-renew method
           // 'subscription.paymentMethodId': null
         }
       };

      const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });

      // --- Send Confirmation Email ---
      if (updatedUser && updatedUser.email) {
        const subject = `Your ${plan.toUpperCase()} Plan Activated!`;
        const html = `
          <h1>Plan Activated!</h1>
          <p>Hello ${user.name || 'User'},</p>
          <p>Your manual payment for the <strong>${plan} (${billingCycle})</strong> plan was successful.</p>
          <ul>
            <li>Plan: ${plan}</li>
            <li>Billing Cycle: ${billingCycle}</li>
            <li>Start Date: ${startDate.toLocaleDateString()}</li>
            <li>Expiry Date: ${endDate.toLocaleDateString()}</li>
            <li>Payment ID: ${razorpay_payment_id}</li>
            <li>Order ID: ${razorpay_order_id}</li>
            ${proratedAdjustmentApplied ? '<li>Your new expiry date includes remaining time from your previous plan.</li>' : ''}
            <li>This plan requires manual renewal before the expiry date. We'll send you reminders.</li>
          </ul>
          <p>Thank you!</p>
        `;
        await sendEmail(updatedUser.email, subject, html);
      } else {
         console.warn(`Could not send confirmation email: User ${userId} not found or has no email address.`);
      }
      // --- End Send Email ---

      res.json({
        status: 'success',
        message: 'Payment successful and plan updated (manual)',
        user: updatedUser,
        transaction: transaction
      });

    } else {
      // Invalid signature
      console.error(`Invalid signature for order ${razorpay_order_id}. Generated: ${generatedSignature}, Received: ${razorpay_signature}`);
      transaction.status = 'failed';
      transaction.notes.failure_reason = 'Invalid signature';
      transaction.updatedAt = new Date();
      await transaction.save();

      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (error) {
     console.error("Verify order error:", error);
      // Attempt to update transaction status to failed
     if (req.body.razorpay_order_id) {
         try {
             await Transaction.findOneAndUpdate(
                 { orderId: req.body.razorpay_order_id, status: { $ne: 'captured' } },
                 { $set: { status: 'failed', 'notes.failure_reason': 'Verification process error: ' + error.message, updatedAt: new Date() } }
             );
         } catch (dbError) {
             console.error("Failed to update transaction status on error:", dbError);
         }
     }
    res.status(500).json({ status: 'error', message: error.message, stack: error.stack });
  }
});

router.get('/renewal-callback', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = req.query;
    console.log(req.query)
    console.log('Razorpay Callback Received:');
    console.log('razorpay_payment_id:', razorpay_payment_id);
    console.log('razorpay_payment_link_id:', razorpay_payment_link_id);
    console.log('razorpay_payment_link_reference_id:', razorpay_payment_link_reference_id);
    console.log('razorpay_payment_link_status:', razorpay_payment_link_status);
    console.log('razorpay_signature:', razorpay_signature);
    
    if (razorpay_payment_link_status !== 'paid') {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=payment_not_completed`);
    }
    
    // Find the transaction by payment link ID
    const transaction = await Transaction.findOne({ paymentLinkId: razorpay_payment_link_id });
    
    if (!transaction) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=transaction_not_found`);
    }
    
    // Verify the payment signature
    // Replace your current signature verification with this
    const payload = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(payload);
    const generatedSignature = hmac.digest('hex');
    console.log(generatedSignature)
    console.log(razorpay_signature)
    
    if (generatedSignature !== razorpay_signature) {
      transaction.status = 'failed';
      transaction.notes = { ...transaction.notes, failureReason: 'Invalid signature' };
      await transaction.save();
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=invalid_signature`);
    }
    
    // Mark transaction as paid
    transaction.paymentId = razorpay_payment_id;
    transaction.status = 'captured';
    transaction.updatedAt = new Date();
    await transaction.save();
    
    // Update user's subscription
    const userId = transaction.userId;
    const { plan, billingCycle } = transaction.subscriptionDetails;
    
    // Set subscription dates
    const startDate = new Date();
    let endDate = new Date(startDate);
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'annual') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Check if current subscription is still active
    const user = await User.findById(userId);
    if (user.subscription.status === 'active' && user.subscription.endDate > startDate) {
      // Add remaining time from previous subscription
      const remainingTime = user.subscription.endDate - startDate;
      endDate = new Date(endDate.getTime() + remainingTime);
    }
    
    // Set reminder dates
    const nextPaymentDue = new Date(endDate);
    nextPaymentDue.setDate(nextPaymentDue.getDate() - 7); // 7 days before expiry
    
    // Update user subscription
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'subscription.plan': plan,
          'subscription.billingCycle': billingCycle,
          'subscription.status': 'active',
          'subscription.startDate': startDate,
          'subscription.endDate': endDate,
          'subscription.autoRenew': false,
          'subscription.paymentMode': 'manual',
          'subscription.nextPaymentDue': nextPaymentDue,
          'subscription.firstReminderSent': false,
          'subscription.secondReminderSent': false,
          'subscription.finalReminderSent': false
        }
      }
    );
    
    // Redirect to success page
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    
  } catch (error) {
    console.error('Error processing payment callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=server_error`);
  }
});

router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(JSON.stringify(req.body));
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature === webhookSignature) {
      const event = req.body.event;
      
      // Handle subscription-specific events
      if (event.startsWith('subscription.')) {
        const subscription = req.body.payload.subscription?.entity;
        if (!subscription) {
          return res.status(400).json({ status: 'invalid payload' });
        }
        
        const subscriptionId = subscription.id;
        const transaction = await Transaction.findOne({ subscriptionId: subscriptionId });
        
        if (!transaction) {
          return res.status(404).json({ status: 'transaction not found' });
        }

        switch (event) {
          case 'subscription.activated':
            // Subscription has been activated
            transaction.status = 'active';
            await transaction.save();
            
            await updateSubscription(
              transaction.userId,
              transaction.subscriptionDetails.plan,
              transaction.subscriptionDetails.billingCycle,
              'active',
              transaction.subscriptionDetails.isUpgrade,
              subscriptionId
            );
            break;
            
          case 'subscription.charged':
            // Recurring payment was successful
            const paymentId = req.body.payload.payment?.entity?.id;
            
            // Create a new transaction record for this charge
            await Transaction.create({
              userId: transaction.userId,
              subscriptionId: subscriptionId,
              paymentId: paymentId,
              amount: transaction.amount,
              currency: 'INR',
              status: 'captured',
              subscriptionDetails: {
                plan: transaction.subscriptionDetails.plan,
                billingCycle: transaction.subscriptionDetails.billingCycle,
                isRenewal: true
              },
              notes: transaction.notes
            });
            
            // Update subscription end date
            const user = await User.findById(transaction.userId);
            let newEndDate = new Date(user.subscription.endDate);
            
            if (transaction.subscriptionDetails.billingCycle === 'monthly') {
              newEndDate.setMonth(newEndDate.getMonth() + 1);
            } else if (transaction.subscriptionDetails.billingCycle === 'annual') {
              newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            }
            
            await User.findByIdAndUpdate(
              transaction.userId,
              { $set: { 'subscription.endDate': newEndDate } }
            );
            break;
            
          case 'subscription.pending':
            transaction.status = 'pending';
            await transaction.save();
            break;
            
          case 'subscription.halted':
            // Subscription halted due to payment failures
            transaction.status = 'halted';
            await transaction.save();
            
            await User.findByIdAndUpdate(
              transaction.userId,
              { $set: { 'subscription.status': 'past_due' } }
            );
            break;
            
          case 'subscription.cancelled':
            transaction.status = 'cancelled';
            await transaction.save();
            
              if (user && user.subscription.paymentMode === 'manual') {
                // Keep subscription active but in manual mode
                await User.findByIdAndUpdate(
                  transaction.userId,
                  { $set: { 
                    'subscription.autoRenew': false
                  }}
                );
              } else {
                // Regular cancellation
                await User.findByIdAndUpdate(
                  transaction.userId,
                  { $set: { 
                    'subscription.status': 'inactive',
                    'subscription.autoRenew': false
                  }}
                );
              }
            break;
        }
      }
      
      // Handle payment-specific events for subscription payments
      else if (event.startsWith('payment.')) {
        const payload = req.body.payload.payment?.entity;
        if (!payload) {
          return res.status(400).json({ status: 'invalid payload' });
        }
        
        // Check if this is related to a subscription
        if (payload.order_id && !payload.subscription_id) {
          const transaction = await Transaction.findOne({ 
            orderId: payload.order_id,
            'subscriptionDetails.isRenewal': true,
            'subscriptionDetails.paymentMode': 'manual'
          });
          
          if (transaction) {
            switch (event) {
              case 'payment.authorized':
              case 'payment.captured':
                // Update transaction status
                transaction.paymentId = payload.id;
                transaction.status = 'captured';
                transaction.paymentMethod = payload.method;
                transaction.updatedAt = new Date();
                await transaction.save();
                
                // Update subscription dates
                const user = await User.findById(transaction.userId);
                let newEndDate = new Date();
                
                // If subscription is still active, extend from current end date
                if (user.subscription.status === 'active' && user.subscription.endDate > new Date()) {
                  newEndDate = new Date(user.subscription.endDate);
                }
                
                // Calculate new end date based on billing cycle
                if (transaction.subscriptionDetails.billingCycle === 'monthly') {
                  newEndDate.setMonth(newEndDate.getMonth() + 1);
                } else if (transaction.subscriptionDetails.billingCycle === 'annual') {
                  newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                }
                
                // Calculate next payment due date (7 days before expiry)
                const nextPaymentDue = new Date(newEndDate);
                nextPaymentDue.setDate(nextPaymentDue.getDate() - 7);
                
                // Update user subscription
                await User.findByIdAndUpdate(
                  transaction.userId,
                  { 
                    $set: { 
                      'subscription.status': 'active',
                      'subscription.endDate': newEndDate,
                      'subscription.nextPaymentDue': nextPaymentDue,
                      'subscription.paymentReminderSent': false
                    }
                  }
                );
                break;
                
              case 'payment.failed':
                transaction.status = 'failed';
                transaction.updatedAt = new Date();
                await transaction.save();
                break;
            }
          }
        }
        
      }
      
      // Handle order events (optional, for better tracking)
      else if (event.startsWith('order.')) {
        const payload = req.body.payload.order?.entity;
        if (!payload) {
          return res.status(400).json({ status: 'invalid payload' });
        }
        
        // Check if this is a manual renewal order
        if (payload.notes?.isRenewal === 'true' || payload.notes?.isRenewal === true) {
          const transaction = await Transaction.findOne({ orderId: payload.id });
          
          if (transaction) {
            switch (event) {
              case 'order.paid':
                // Order has been paid successfully
                transaction.status = 'paid';
                transaction.updatedAt = new Date();
                await transaction.save();
                break;
            }
          }
        }
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

async function updateSubscription(userId, plan, billingCycle, status, isUpgrade = false, subscriptionId = null) {
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


router.post('/cancel-subscription', async (req, res) => {
  try {
      const { userId, subscriptionId, reason, feedback } = req.body;
      
      if (!userId || !subscriptionId) {
          return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const endDate = user.subscription.endDate;
      const formattedEndDate = endDate.toLocaleDateString();

      if (user.subscription.status === 'cancelling' || user.subscription.status === 'inactive') {
        return res.status(400).json({ error: 'Subscription is already being cancelled or is inactive.' });
      }
      if (user.subscription.paymentMode === 'automatic') {
        // Cancel with Razorpay for automatic payment mode
        await razorpay.subscriptions.cancel(subscriptionId);
        
        await User.findByIdAndUpdate(
          userId,
          { $set: { 
            'subscription.autoRenew': false,
            'subscription.status': 'cancelling',
            'subscription.cancellationReason': reason || 'Not specified',
            'subscription.cancellationFeedback': feedback || '',
            'subscription.cancelledAt': new Date()
          }}
        );
        
        res.json({ 
          status: 'success', 
          message: `Subscription cancellation initiated. Your subscription will remain active until ${formattedEndDate}.`
        });
      } else if (user.subscription.paymentMode === 'manual') {
        // For manual payment mode, just update the database
        await User.findByIdAndUpdate(
          // userId,
          // { $set: { 
          //   'subscription.status': 'inactive',
          //   'subscription.plan': 'free',
          //   'subscription.cancellationReason': reason || 'Not specified',
          //   'subscription.cancellationFeedback': feedback || '',
          //   'subscription.cancelledAt': new Date()
          // }}
          userId,
          { $set: { 
            'subscription.autoRenew': false,
            'subscription.status': 'cancelling',
            'subscription.cancellationReason': reason || 'Not specified',
            'subscription.cancellationFeedback': feedback || '',
            'subscription.cancelledAt': new Date()
          }}
        
        );
        
        res.json({ 
          status: 'success', 
          // message: 'Your subscription has been cancelled and your account has been switched to the free plan.'
          message: `Subscription cancellation initiated. Your subscription will remain active until ${formattedEndDate}.`
        });
      } else {
        return res.status(400).json({ error: 'Invalid payment mode' });
      }
  } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ status: 'error', message: error.message });
  }
});


// Cancel a pending subscription (that hasn't been paid for yet)
router.post('/cancel-pending-subscription', async (req, res) => {
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
          return res.status(404).json({ message: "No pending subscription found for this plan." });
      }

      // If there's a subscription ID, cancel it in Razorpay
      if (pendingTransaction.subscriptionId) {
          try {
              await razorpay.subscriptions.cancel(pendingTransaction.subscriptionId);
          } catch (razorError) {
              console.warn('Error cancelling subscription in Razorpay:', razorError);
              // Continue with local cancellation even if Razorpay throws an error
          }
      }

      pendingTransaction.status = 'cancelled';
      pendingTransaction.updatedAt = new Date();
      await pendingTransaction.save();

      res.json({ status: 'success', message: "Pending subscription cancelled successfully." });
  } catch (error) {
      console.error("Error cancelling pending subscription:", error);
      res.status(500).json({ status: 'error', message: "Failed to cancel pending subscription.", error: error.message });
  }
});

router.post('/update-payment-mode', async (req, res) => {
  try {
    const { userId, paymentMode, effectiveDate } = req.body;
   
    if (!['automatic', 'manual'].includes(paymentMode)) {
      return res.status(400).json({ error: 'Invalid payment mode. Must be automatic or manual' });
    }
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
   
    if (user.subscription.status !== 'active') {
      return res.status(400).json({ error: 'No active subscription found' });
    }
   
    
    const subscriptionId = user.subscription.subscriptionId;
    console.log(subscriptionId)
    let subscription;
   
    try {
      subscription = await razorpay.subscriptions.fetch(subscriptionId);
    } catch (error) {
      console.error('Razorpay Fetch Error:', error);
      return res.status(400).json({ error: 'Could not fetch subscription details', details: error.message });
}

    
    if (paymentMode === 'manual' && user.subscription.paymentMode === 'automatic') {
      if (effectiveDate) {
        await User.findByIdAndUpdate(
          userId,
          { 
            $set: { 
              'subscription.pendingPaymentMode': 'manual',
              'subscription.paymentModeChangeDate': effectiveDate
            } 
          }
        );
        
        res.json({
          status: 'success',
          message: `Payment mode will change to manual when your subscription expires`,
          user: await User.findById(userId)
        });
        return;
      } else {
        // If no effective date provided, cancel immediately
        await razorpay.subscriptions.cancel(subscriptionId);
      }
    }
    
    // Update user record for immediate changes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'subscription.paymentMode': paymentMode } },
      { new: true }
    );
   
    res.json({
      status: 'success',
      message: `Payment mode updated to ${paymentMode}`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cancel-manual-payment-change', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.subscription.status !== 'active') {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    if (user.subscription.pendingPaymentMode === 'manual') {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'subscription.pendingPaymentMode': null,
            'subscription.paymentModeChangeDate': null,
            'subscription.paymentMode': 'automatic',
          },
        },
        { new: true }
      );

      res.json({
        status: 'success',
        message: 'Pending manual payment change cancelled. Payment mode reverted to automatic.',
        user: await User.findById(userId),
      });
      return;
    } else {
      return res.status(400).json({ error: 'No pending manual payment change found for this user.' });
    }
  } catch (error) {
    console.error('Error cancelling manual payment change:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/pay-renewal', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.subscription.status !== 'active' && user.subscription.status !== 'past_due') {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Calculate amount based on current plan
    let amount;
    if (user.subscription.plan === 'basic') {
      amount = user.subscription.billingCycle === 'monthly' ? 352.82 : 3596.64;
    } else if (user.subscription.plan === 'premium') {
      amount = user.subscription.billingCycle === 'monthly' ? 706.82 : 7209.80;
    } else {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }
    
    // Create an order for manual payment
    const orderOptions = {
      amount: Math.round(amount * 100), // Razorpay requires amount in paise
      currency: 'INR',
      receipt: `manual_renewal_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        subscriptionId: user.subscription.subscriptionId,
        renewalFor: `${user.subscription.plan}_${user.subscription.billingCycle}`,
        isRenewal: true
      }
    };
    
    const order = await razorpay.orders.create(orderOptions);
    
    // Create a transaction record
    const transaction = await Transaction.create({
      userId: userId,
      orderId: order.id,
      subscriptionId: user.subscription.subscriptionId,
      amount: amount,
      currency: 'INR',
      status: 'created',
      subscriptionDetails: {
        plan: user.subscription.plan,
        billingCycle: user.subscription.billingCycle,
        isRenewal: true,
        paymentMode: 'manual'
      },
      notes: orderOptions.notes
    });
    
    res.json({
      order: order,
      transactionId: transaction._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-renewal-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;
    
    const transaction = await Transaction.findOne({ 
      orderId: razorpay_order_id,
      'subscriptionDetails.isRenewal': true,
      'subscriptionDetails.paymentMode': 'manual'
    });
    
    if (!transaction) {
      return res.status(404).json({ status: 'failed', message: 'Transaction not found' });
    }
    
    if (transaction.paymentId) {
      return res.status(400).json({ 
        status: 'duplicate', 
        message: 'This payment was already processed',
        transaction: transaction
      });
    }
    
    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      // Fetch payment details
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      
      // Update transaction record
      transaction.paymentId = razorpay_payment_id;
      transaction.status = 'captured';
      transaction.paymentMethod = paymentDetails.method;
      transaction.updatedAt = new Date();
      await transaction.save();
      
      // Update subscription dates
      const user = await User.findById(transaction.userId);
      let newEndDate = new Date();
      
      // If subscription is still active, extend from current end date
      if (user.subscription.status === 'active' && user.subscription.endDate > new Date()) {
        newEndDate = new Date(user.subscription.endDate);
      }
      
      // Calculate new end date based on billing cycle
      if (transaction.subscriptionDetails.billingCycle === 'monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else if (transaction.subscriptionDetails.billingCycle === 'annual') {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }
      
      // Calculate next payment due date (7 days before expiry)
      const nextPaymentDue = new Date(newEndDate);
      nextPaymentDue.setDate(nextPaymentDue.getDate() - 7);
      
      // Update user subscription
      const updatedUser = await User.findByIdAndUpdate(
        transaction.userId,
        { 
          $set: { 
            'subscription.status': 'active',
            'subscription.endDate': newEndDate,
            'subscription.nextPaymentDue': nextPaymentDue,
            'subscription.paymentReminderSent': false
          }
        },
        { new: true }
      );
      
      res.json({ 
        status: 'success', 
        message: 'Payment successful and subscription renewed',
        user: updatedUser,
        transaction: transaction
      });
    } else {
      // Invalid signature
      transaction.status = 'failed';
      transaction.updatedAt = new Date();
      await transaction.save();
      
      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/check-payment-reminders', async (req, res) => {
  try {
    // Find users with manual payment mode and upcoming payments
    const today = new Date();
    const users = await User.find({
      'subscription.paymentMode': 'manual',
      'subscription.status': 'active',
      'subscription.nextPaymentDue': { $lte: today },
      'subscription.paymentReminderSent': false
    });
    
    // Process each user to send reminders
    for (const user of users) {
      // In a real implementation, send email/notification here
      console.log(`Payment reminder for user ${user._id}, plan ${user.subscription.plan}`);
      
      // Mark reminder as sent
      user.subscription.paymentReminderSent = true;
      user.subscription.lastPaymentReminder = today;
      await user.save();
    }
    
    res.json({ 
      success: true, 
      remindersCount: users.length,
      message: `Processed ${users.length} payment reminders` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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