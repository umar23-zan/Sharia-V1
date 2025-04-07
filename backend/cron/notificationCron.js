const cron = require('node-cron');
const mongoose = require('mongoose');
const notificationService = require('../service/NotificationService');
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = "mongodb+srv://umar:umar444@authentication-app.ted5m.mongodb.net/";
const DATABASE_NAME = "authdb";
const COLLECTION_NAME = "news_analysis";

/**
 * Initialize the cron job for generating notifications
 */
const initNotificationCron = () => {
  // Run every hour
  cron.schedule('0 0 * * *', async () => {
    try {
      client = await MongoClient.connect(MONGO_URI);
        const db = client.db(DATABASE_NAME);
      console.log('Running notification generation cron job');
      
      // Find unprocessed classifications (HARAM or UNCERTAIN)
      const unprocessedClassifications = await db.collection(COLLECTION_NAME).find({
        classification: { $in: ['HARAM', 'UNCERTAIN'] }
      }).toArray();
      
      if (unprocessedClassifications.length === 0) {
        console.log('No new classifications to process');
        return;
      }
      
      console.log(`Found ${unprocessedClassifications.length} unprocessed classifications`);
      
      // Process the classifications
      const notificationsCreated = await notificationService.batchProcessClassifications(unprocessedClassifications);
      
      console.log(`Created ${notificationsCreated} new notifications`);
    } catch (error) {
      console.error('Error running notification cron job:', error);
    }
  });
  
  console.log('Notification cron job initialized');
};

module.exports = {
  initNotificationCron
};