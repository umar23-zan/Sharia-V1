const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    stockData: { type: Object, required: true }, // Store StockData
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
