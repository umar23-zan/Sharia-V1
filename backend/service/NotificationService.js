const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const fuzz = require('fuzzball');

class NotificationService {
    async generateNotifications(stockClassification) {
        try {
            // console.log(stockClassification)
            const classification = stockClassification.classification;
            if (classification !== 'HARAM' && classification !== 'UNCERTAIN') {
                return;
            }
    
            const stocksMentioned = stockClassification.stocks_mentioned || [];
            if (stocksMentioned.length === 0) {
                console.log('No stocks mentioned in the classification');
                return;
            }
    
            const stockNames = stocksMentioned.map(stock => stock.company_name?.trim()).filter(Boolean);
            const stockSymbols = stocksMentioned.map(stock => stock.nse_symbol?.trim()).filter(symbol => symbol && symbol !== 'Not Listed');
    
            // console.log("Stock Names:", stockNames);
            // console.log("Stock Symbols:", stockSymbols);
    
            const users = await User.find({
                $or: [
                    { 'watchlist.symbol': { $in: stockSymbols } },
                    { 'watchlist.companyName': { $in: stockNames } }
                ]
            });
    
            // console.log(`Found ${users.length} users with matching stocks in watchlist`);
    
            const notificationPromises = [];
    
            for (const user of users) {
                for (const watchlistItem of user.watchlist) {
                    // console.log(watchlistItem.stockData.Initial_Classification)
                    if (
                        !watchlistItem.stockData ||
                        watchlistItem.stockData.Initial_Classification?.toLowerCase() !== 'halal'
                    ) {
                        continue;
                    }

                    const symbolMatch = stockSymbols.includes(watchlistItem.symbol);
                    const nameMatch = stockNames.includes(watchlistItem.companyName);
    
                    if (symbolMatch || nameMatch) {
                        notificationPromises.push(this.createNotification(user, watchlistItem, stockClassification));
                    } else {
                        // Fuzzy match fallback if exact match fails
                        const bestMatch = fuzz.extract(
                            watchlistItem.companyName,
                            stockNames,
                            { scorer: fuzz.partial_ratio }
                        );
    
                        if (bestMatch.length > 0 && bestMatch[0][1] > 75) {
                            notificationPromises.push(this.createNotification(user, watchlistItem, stockClassification));
                        }
                    }
                }
            }
    
            await Promise.all(notificationPromises);
            return notificationPromises.length;
        } catch (error) {
            console.error('Error generating notifications:', error);
            throw error;
        }
    }
    

    async createNotification(user, watchlistItem, stockClassification) {
        try {
            const existingNotification = await Notification.findOne({
                userId: user._id,
                stockSymbol: watchlistItem.symbol,
                headline: stockClassification.headline
            });

            if (!existingNotification) {
                const notification = new Notification({
                    userId: user._id,
                    stockSymbol: watchlistItem.symbol,
                    companyName: watchlistItem.companyName,
                    // classification: stockClassification.classification,
                    classification: "UNDER REVIEW",
                    headline: stockClassification.headline,
                    summary: stockClassification.summary,
                    reason: stockClassification.reason,
                    key_violations: stockClassification.key_violations || [],
                    articleUrl: stockClassification.url
                });

                return notification.save();
            }
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    async getUserNotifications(userId, type = 'all') {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid User ID format');
            }

            const objectId = new mongoose.Types.ObjectId(userId);
            const query = { userId: objectId };

            if (type.toLowerCase() === 'haram') {
                query.classification = 'HARAM';
            } else if (type.toLowerCase() === 'uncertain') {
                query.classification = 'UNCERTAIN';
            }

            return await Notification.find(query).sort({ createdAt: -1 }).lean();
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw error;
        }
    }

    async markAsRead(notificationId) {
        try {
            await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
          return await Notification.findByIdAndDelete(notificationId);
        } catch (error) {
          console.error('Error deleting notification:', error);
          throw error;
        }
      }
      

    async batchProcessClassifications(classifications) {
        try {
            let totalNotifications = 0;
            for (const classification of classifications) {
                const count = await this.generateNotifications(classification);
                totalNotifications += count || 0;
            }
            return totalNotifications;
        } catch (error) {
            console.error('Error batch processing classifications:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();
