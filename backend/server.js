const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const stockDataRoutes = require('./routes/stockDataRoutes');
const watchlistRoutes = require('./routes/watchlist')
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const paymentRoutes = require('./routes/paymentmethods')
const transactionRoutes = require('./routes/transaction')
const notificationRoutes = require('./routes/notification')
const blogRoutes = require('./routes/blogroutes');
const { initNotificationCron } = require('./cron/notificationCron');

const cors = require('cors');
const app = express();
require('dotenv').config();
require('./config/passport')(app);
require('./cron/scheduledTasks')

connectDB();
initNotificationCron();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stocks',stockDataRoutes);
app.use('/api/subscribe',subscriptionRoutes);
app.use('/api/watchlist', watchlistRoutes)
app.use("/api/payments", paymentRoutes);
app.use('/api/transaction', transactionRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/blogs', blogRoutes);


app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
