const cron = require('node-cron');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
const Transaction = require('../models/Transaction');



const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function createPaymentLink(user, plan, billingCycle) {
  try {
    const amount = getAmountForPlan(plan, billingCycle);
    const customerContact = user.phone ? String(user.phone) : "9442442233";
    // Create a payment link using Razorpay's Payment Links API
    const paymentLinkOptions = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `Subscription renewal for ${plan} plan (${billingCycle})`,
      customer: {
        name: user.name,
        email: user.email,
        contact: customerContact,
      },
      notify: {
        email: true,
        sms: Boolean(user.phone)
      },
      reminder_enable: true,
      notes: {
        userId: user._id.toString(),
        plan: plan,
        billingCycle: billingCycle,
        isRenewal: true
      },
      callback_url: `${process.env.FRONTEND_URL}/api/transaction/renewal-callback`,
      callback_method: 'get',
      // reference_id: 'myverysecuresecretkey123'
    };
    
    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    
    // Create transaction record
    const transaction = await Transaction.create({
      userId: user._id,
      paymentLinkId: paymentLink.id,
      amount: amount,
      currency: 'INR',
      status: 'created',
      subscriptionDetails: {
        plan: plan,
        billingCycle: billingCycle,
        isRenewal: true,
        paymentMode: 'manual'
      },
      notes: paymentLinkOptions.notes
    });
    
    return {
      paymentLink: paymentLink.short_url,
      transaction: transaction
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}

cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Part 1: Process manual payment mode changes
    const usersForPaymentModeChange = await User.find({
      'subscription.status': 'active',
      'subscription.pendingPaymentMode': 'manual',
      'subscription.paymentModeChangeDate': { $lte: today }
    });
    
    for (const user of usersForPaymentModeChange) {
      try {
        // Cancel the subscription in Razorpay
        await razorpay.subscriptions.cancel(user.subscription.subscriptionId);
        
        // Update user record
        await User.findByIdAndUpdate(
          user._id,
          {
            $set: { 'subscription.paymentMode': 'manual' },
            $unset: { 
              'subscription.pendingPaymentMode': 1, 
              'subscription.paymentModeChangeDate': 1 
            }
          }
        );
        
        console.log(`Subscription ${user.subscription.subscriptionId} canceled for user ${user._id} due to payment mode change`);
      } catch (error) {
        console.error(`Failed to cancel subscription for user ${user._id}:`, error);
      }
    }

    // Part 2: Process subscription status changes from cancelling to inactive
    const usersWithExpiredSubscriptions = await User.find({
      'subscription.status': 'cancelling',
      'subscription.endDate': { $lt: today }
    });
    
    for (const user of usersWithExpiredSubscriptions) {
      try {
        await User.findByIdAndUpdate(
          user._id,
          { $set: { 'subscription.status': 'inactive' } }
        );
        
        console.log(`Updated subscription status to inactive for user ${user._id}`);
      } catch (error) {
        console.error(`Failed to update subscription status for user ${user._id}:`, error);
      }
    }

    console.log(`Daily subscription job completed: Processed ${usersForPaymentModeChange.length} payment mode changes and ${usersWithExpiredSubscriptions.length} subscription expirations`);

    const usersToRemind = await User.find({
      'subscription.paymentMode': 'manual',
      'subscription.status': 'active',
      'subscription.endDate': { $gte: today },
      $or: [
        // First reminder: 7 days before expiration
        {
          'subscription.firstReminderSent': false,
          'subscription.endDate': { 
            $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) 
          }
        },
        // Second reminder: 3 days before expiration
        {
          'subscription.secondReminderSent': false,
          'subscription.endDate': { 
            $lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) 
          }
        },
        // Final reminder: 1 day before expiration
        {
          'subscription.finalReminderSent': false,
          'subscription.endDate': { 
            $lte: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000) 
          }
        }
      ]
    });
    
    console.log(`Found ${usersToRemind.length} users to remind`);
  
    for (const user of usersToRemind) {
      // Calculate days remaining
      const daysRemaining = Math.ceil((user.subscription.endDate - today) / (24 * 60 * 60 * 1000));
      console.log(`Processing user ${user._id}, days remaining: ${daysRemaining}`);
      
      const { paymentLink, transaction } = await createPaymentLink(
        user, 
        user.subscription.plan, 
        user.subscription.billingCycle
      );
      // Determine reminder type and update user accordingly
      let reminderType, updateField;
      if (daysRemaining <= 1 && !user.subscription.finalReminderSent) {
        reminderType = 'FINAL';
        updateField = 'finalReminderSent';
      } else if (daysRemaining <= 3 && !user.subscription.secondReminderSent) {
        reminderType = 'SECOND';
        updateField = 'secondReminderSent';
      } else if (daysRemaining <= 7 && !user.subscription.firstReminderSent) {
        reminderType = 'FIRST';
        updateField = 'firstReminderSent';
      } else {
        console.log(`No reminder needed for user ${user._id}`);
        continue;
      }
      
      console.log(`Sending ${reminderType} reminder to user ${user._id}`);
      
      // Send email reminder
      const emailSubject = `${reminderType === 'FINAL' ? 'URGENT: ' : ''}Your subscription expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
      const emailText = `
        Dear ${user.name},
        
        Your ${user.subscription.plan} subscription will expire in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.
        
        To continue enjoying our services without interruption, please renew your subscription by clicking the link below:
        
        ${paymentLink}
        
        If you have any questions or need assistance, please contact our support team.
        
        Thank you for your continued support!
      `;
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: emailSubject,
        text: emailText
      });
      
     
      
      // Update user to mark reminder as sent
      await User.findByIdAndUpdate(
        user._id,
        { $set: { [`subscription.${updateField}`]: true } }
      );
      
      console.log(`Reminder sent to user ${user._id}`);
    }
    
    // Handle expired subscriptions
    const expiredUsers = await User.find({
      'subscription.paymentMode': 'manual',
      'subscription.status': 'active',
      'subscription.endDate': { $lt: today }
    });
    
    console.log(`Found ${expiredUsers.length} expired subscriptions`);
    
    for (const user of expiredUsers) {
      // Update subscription status to expired
      await User.findByIdAndUpdate(
        user._id,
        { $set: { 'subscription.status': 'expired' } }
      );
      
      // Send expiration notification
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Your subscription has expired',
        text: `
          Dear ${user.name},
          
          Your ${user.subscription.plan} subscription has expired.
          
          To restore access to our services, please renew your subscription at your earliest convenience:
          
          ${process.env.FRONTEND_URL}/subscription
          
          If you have any questions or need assistance, please contact our support team.
          
          Thank you for choosing our service!
        `
      });
      
      console.log(`Marked subscription as expired for user ${user._id}`);
    }
    
    console.log('Subscription reminder check completed');

  } catch (error) {
    console.error('Error in subscription job:', error);
  }
});

function getAmountForPlan(plan, billingCycle) {
  if (plan === 'basic') {
    return billingCycle === 'monthly' ? 352.82 : 2964.16;
  } else if (plan === 'premium') {
    return billingCycle === 'monthly' ? 588.82 : 4,946.56;
  }
  return 0
}