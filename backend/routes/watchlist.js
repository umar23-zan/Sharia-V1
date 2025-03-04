const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist'); // Create this model

// Add stock to watchlist
router.post('/', async (req, res) => {
    try {
        const { userId, symbol, companyName, stockData } = req.body;

        // Check if the stock is already in the watchlist
        const existingStock = await Watchlist.findOne({ userId, symbol });
        if (existingStock) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }

        // Add new stock to watchlist
        const newStock = new Watchlist({
            userId,
            symbol,
            companyName,
            stockData,
        });
        await newStock.save();
        res.status(201).json({ message: 'Stock added to watchlist', data: newStock });
    } catch (error) {
        console.error('Error adding stock to watchlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      
      // Fetch stocks from watchlist for the user
      const watchlistStocks = await Watchlist.find({ userId });

      res.status(200).json({ watchlist: watchlistStocks });
  } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
