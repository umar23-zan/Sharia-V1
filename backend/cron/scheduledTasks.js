const cron = require('node-cron');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../service/emailService')
const Transaction = require('../models/Transaction');
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


console.log('Scheduler started. Waiting for scheduled jobs.');

const formatDate = (date) => date ? date.toLocaleDateString() : 'N/A';

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily check for automatic renewal reminders...');
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + 7); // Target date 7 days from now

  try {
    const usersToRemind = await User.find({
      'subscription.status': 'active',
      'subscription.autoRenew': true,
      'subscription.paymentMode': 'automatic',
      'subscription.endDate': { 
         $gte: new Date(reminderDate.setHours(0, 0, 0, 0)), 
         $lt: new Date(reminderDate.setHours(23, 59, 59, 999)) 
       },
      'subscription.paymentReminderSent': { $ne: true } 
    }).select('email name subscription'); 

    console.log(`Found ${usersToRemind.length} users for auto-renewal reminder.`);

    for (const user of usersToRemind) {
      const { plan, billingCycle, endDate } = user.subscription;
      const subject = `Upcoming Renewal for Your ${plan.toUpperCase()} Subscription`;
      const html = `
        <h1>Subscription Renewal Reminder</h1>
        <p>Hello ${user.name || 'User'},</p>
        <p>This is a friendly reminder that your <strong>${plan} (${billingCycle})</strong> subscription is scheduled to automatically renew on <strong>${formatDate(endDate)}</strong>.</p>
        <p>No action is needed if you wish to continue. Your default payment method will be charged.</p>
        <p>If you need to update your payment method or manage your subscription, please visit your account settings.</p>
        <p>Thank you!</p>
      `;

      await sendEmail(user.email, subject, html);

      await User.updateOne(
        { _id: user._id },
        { $set: { 'subscription.paymentReminderSent': true } }
      );
      console.log(`Auto-renewal reminder sent to ${user.email}`);
    }

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
            $set: {
               'subscription.paymentMode': 'manual',
              'subscription.status': 'inactive',
              'subscription.plan': 'free'
             },
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
     const usersWithCancelledSubscriptions = await User.find({
      'subscription.status': 'cancelling',
      'subscription.endDate': { $lt: today }
    });
    
    for (const user of usersWithCancelledSubscriptions) {
      try {
        await User.findByIdAndUpdate(
          user._id,
          { $set: { 
            'subscription.status': 'inactive',
            'subscription.plan':'free',
           } }
        );
        
        console.log(`Updated subscription status to inactive for user ${user._id}`);
      } catch (error) {
        console.error(`Failed to update subscription status for user ${user._id}:`, error);
      }
    }

     // Part 3: Process subscription status changes from active to inactive
     const usersWithExpiredSubscriptions = await User.find({
      'subscription.status': 'active',
      'subscription.endDate': { $lt: today }
    });
    
    for (const user of usersWithExpiredSubscriptions) {
      try {
        await User.findByIdAndUpdate(
          user._id,
          { $set: { 
            'subscription.status': 'expired',
            'subscription.plan': 'free',
           } }
        );
        
        console.log(`Updated subscription status to inactive for user ${user._id}`);
      } catch (error) {
        console.error(`Failed to update subscription status for user ${user._id}:`, error);
      }
    }
    // Part 4: Process subscription status changes from active to inactive for failed automatic payments
    const usersWithPaymentIssues = await User.find({

        'subscription.status': 'past_due' ,
        'subscription.status': 'active', 'subscription.paymentMode': 'automatic', 'subscription.subscriptionId': { $exists: true, $ne: null }
      
    }).select('_id email name subscription razorpayCustomerId');
    console.log(`Found ${usersWithPaymentIssues.length} users with potential payment issues.`);
    
    const processedUsers = [];
    
    for (const user of usersWithPaymentIssues) {
      try {
        // For users with active status, check subscription in Razorpay
        if (user.subscription.status === 'active' && user.subscription.subscriptionId) {
          const subscriptionData = await razorpay.subscriptions.fetch(user.subscription.subscriptionId);
          
          // Check if subscription status indicates payment issues
          if (subscriptionData.status === 'halted' || subscriptionData.status === 'pending') {
            // Update user status to reflect payment issues
            await User.findByIdAndUpdate(
              user._id,
              { $set: { 'subscription.status': 'past_due' } }
            );
            
            // Find the most recent transaction for this subscription
            const latestTransaction = await Transaction.findOne({
              userId: user._id,
              subscriptionId: user.subscription.subscriptionId
            }).sort({ createdAt: -1 });
            
            if (latestTransaction) {
              latestTransaction.status = subscriptionData.status;
              await latestTransaction.save();
            }
            
            // Add user to the processed list
            user.subscription.status = 'past_due'; // Update for email purposes
            processedUsers.push(user);
          }
        }
                // For users already marked as past_due, send payment failure notification
                if (user.subscription.status === 'past_due') {
                  const subject = 'Action Required: Subscription Payment Failed';
                  const html = `
                    <h1>Subscription Payment Issue</h1>
                    <p>Hello ${user.name || 'User'},</p>
                    <p>We were unable to process the automatic payment for your <strong>${user.subscription.plan} (${user.subscription.billingCycle})</strong> subscription.</p>
                    <p>To keep your subscription active, please:</p>
                    <ol>
                      <li>Update your payment details in your account settings</li>
                      <li>Contact our support team if you need assistance</li>
                    </ol>
                    <p>If the payment issue is not resolved within 7 days, your subscription benefits may be suspended.</p>
                    <p>Thank you for your prompt attention to this matter.</p>
                  `;
                  
                  await sendEmail(user.email, subject, html);
                  console.log(`Payment failure notification sent to ${user.email}`);
                  
                  // Track when the payment reminder was sent
                  await User.findByIdAndUpdate(
                    user._id,
                    { $set: { 'subscription.lastPaymentReminder': new Date() } }
                  );
                  
                  processedUsers.push(user);
                }
              } catch (error) {
                console.error(`Error processing payment issues for user ${user._id}:`, error);
              }
            }
            
            // Check for subscriptions that have been in past_due state for too long (e.g., 15 days)
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            
            const longOverdueUsers = await User.find({
              'subscription.status': 'past_due',
              'subscription.lastPaymentReminder': { $lt: threeDaysAgo }
            });
            
            for (const user of longOverdueUsers) {
              try {
                // Cancel subscription in Razorpay if it exists
                if (user.subscription.subscriptionId) {
                  await razorpay.subscriptions.cancel(user.subscription.subscriptionId);
                }
                
                // Update user record
                await User.findByIdAndUpdate(
                  user._id,
                  { 
                    $set: { 
                      'subscription.status': 'inactive',
                      'subscription.plan': 'free',
                      'subscription.autoRenew': false,
                      'subscription.cancelledAt': new Date(),
                      'subscription.cancellationReason': 'Payment failure'
                    }
                  }
                );
                
                // Send cancellation email
                const subject = 'Subscription Cancelled: Payment Issues';
                const html = `
                  <h1>Subscription Cancelled</h1>
                  <p>Hello ${user.name || 'User'},</p>
                  <p>Due to ongoing payment issues, your <strong>${user.subscription.plan} (${user.subscription.billingCycle})</strong> subscription has been cancelled.</p>
                  <p>Your account has been downgraded to the free plan.</p>
                  <p>If you would like to reactivate your premium features, please visit your account settings to set up a new subscription.</p>
                  <p>Thank you for your understanding.</p>
                `;
                
                await sendEmail(user.email, subject, html);
                console.log(`Subscription cancellation notice sent to ${user.email}`);
              } catch (error) {
                console.error(`Error cancelling overdue subscription for user ${user._id}:`, error);
              }
            }
        

  } catch (error) {
    console.error('Error processing automatic renewal reminders:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" 
});

cron.schedule('5 8 * * *', async () => {
  console.log('Running daily check for manual expiry reminders...');
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const reminderDate7 = new Date(today);
  reminderDate7.setDate(today.getDate() + 7); 
  const reminderDate3 = new Date(today);
  reminderDate3.setDate(today.getDate() + 3); 
  const reminderDate1 = new Date(today);
  reminderDate1.setDate(today.getDate() + 1); 


   try {
    const usersToRemind = await User.find({
       'subscription.status': 'active',
       'subscription.autoRenew': false,
       'subscription.paymentMode': 'manual',
       'subscription.endDate': { // Find subscriptions ending within the next 7 days
         $gte: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Starting from tomorrow
         $lt: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000) // Up to 7 days from now
       }
     }).select('email name subscription'); // Select only necessary fields

     console.log(`Found ${usersToRemind.length} users potentially needing manual expiry reminders.`);

     for (const user of usersToRemind) {
       const { plan, billingCycle, endDate, firstReminderSent, secondReminderSent, finalReminderSent } = user.subscription;
       let subject = '';
       let html = '';
       let reminderToSend = null; // 'first', 'second', 'final'
       let updatePayload = {};

        // Check end date against reminder dates (ensure comparison ignores time part)
       const endDateDay = new Date(endDate);
       endDateDay.setHours(0, 0, 0, 0);

       // Check for 7-day reminder
       if (!firstReminderSent && endDateDay.getTime() === reminderDate7.getTime()) {
         reminderToSend = 'first';
         subject = `Action Required: Your ${plan.toUpperCase()} Plan Expires in 7 Days`;
         html = `
            <h1>Plan Expiry Reminder</h1>
            <p>Hello ${user.name || 'User'},</p>
            <p>Your <strong>${plan} (${billingCycle})</strong> plan will expire on <strong>${formatDate(endDate)}</strong> (in 7 days).</p>
            <p>To continue enjoying the benefits, please renew your plan manually before the expiry date.</p>
            <p>Thank you!</p>
         `;
         updatePayload = { 'subscription.firstReminderSent': true };
       }
        // Check for 3-day reminder (use else if to prevent multiple emails on the same day if logic overlaps)
       else if (!secondReminderSent && endDateDay.getTime() === reminderDate3.getTime()) {
         reminderToSend = 'second';
         subject = `Action Required: Your ${plan.toUpperCase()} Plan Expires in 3 Days`;
          html = `
            <h1>Plan Expiry Reminder</h1>
            <p>Hello ${user.name || 'User'},</p>
            <p>Just a reminder that your <strong>${plan} (${billingCycle})</strong> plan will expire on <strong>${formatDate(endDate)}</strong> (in 3 days).</p>
            <p>Renew now to avoid any interruption in service.</p>
            <p>Thank you!</p>
         `;
         updatePayload = { 'subscription.secondReminderSent': true };
       }
        // Check for 1-day reminder
       else if (!finalReminderSent && endDateDay.getTime() === reminderDate1.getTime()) {
         reminderToSend = 'final';
         subject = `Final Reminder: Your ${plan.toUpperCase()} Plan Expires Tomorrow!`;
          html = `
            <h1>Final Expiry Reminder</h1>
            <p>Hello ${user.name || 'User'},</p>
            <p>Your <strong>${plan} (${billingCycle})</strong> plan expires tomorrow, <strong>${formatDate(endDate)}</strong>.</p>
            <p>This is your last chance to renew manually and keep your access.</p>
            <p>Thank you!</p>
         `;
         updatePayload = { 'subscription.finalReminderSent': true };
       }


       if (reminderToSend) {
          await sendEmail(user.email, subject, html);
          await User.updateOne({ _id: user._id }, { $set: updatePayload });
          console.log(`Manual expiry reminder (${reminderToSend}) sent to ${user.email} for expiry on ${formatDate(endDate)}`);
       }
     }

   } catch (error) {
      console.error('Error processing manual expiry reminders:', error);
   }

}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Use the same timezone
});

// Optional: Add a job to handle failed automatic payments (requires webhook setup from Razorpay)
// Optional: Add a job to deactivate expired subscriptions daily


// Keep the scheduler running (if it's the main process)
// If run separately, ensure it connects to the DB
// Example DB connection (if run standalone)
/*
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Scheduler connected to MongoDB'))
  .catch(err => console.error('Scheduler MongoDB connection error:', err));
*/