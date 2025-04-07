const cron = require('node-cron');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../service/emailService')
const mongoose = require('mongoose')

console.log('Scheduler started. Waiting for scheduled jobs.');

const formatDate = (date) => date ? date.toLocaleDateString() : 'N/A';

cron.schedule('* * * * *', async () => {
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
            <p>[Link to Renewal Page]</p>
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
            <p>[Link to Renewal Page]</p>
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
            <p>[Link to Renewal Page]</p>
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