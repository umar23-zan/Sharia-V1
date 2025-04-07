const express = require('express')
const notificationService = require('../service/NotificationService')
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const type = req.query.type || 'all';
    const userId = req.query.userId;
    const notifications = await notificationService.getUserNotifications(userId, type);
    
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.classification.toLowerCase(),
      title: notification.headline,
      symbol: notification.stockSymbol,
      description: notification.summary,
      status: notification.classification,
      statusBg: notification.classification === 'HARAM' ? 'bg-red-100' : 'bg-yellow-100',
      statusText: notification.classification === 'HARAM' ? 'text-red-700' : 'text-yellow-700',
      time: new Date(notification.createdAt).toLocaleString(),
      source: 'Shariah Analysis',
      isRead: notification.isRead,
      reason: notification.reason,
      violations: notification.key_violations,
      articleUrl: notification.articleUrl
    }));
    
    res.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/read/:id', async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.query.userId;
    const allNotifications = await notificationService.getUserNotifications(userId);
    const unreadCount = allNotifications.filter(notification => !notification.isRead).length;
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    await notificationService.deleteNotification(notificationId);
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;