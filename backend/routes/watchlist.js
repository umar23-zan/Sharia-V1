const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post("/", async (req, res) => {
    const { userId, stockSymbol } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
  
    const watchlistLimits = { free: 10, basic: 30, premium: 50 };
    if (user.watchlist.length >= watchlistLimits[user.subscription.plan]) {
      return res.status(403).json({ error: "Watchlist limit exceeded" });
    }
  
    user.watchlist.push(stockSymbol);
    await user.save();
    res.json({ message: "Stock added to watchlist", watchlist: user.watchlist });
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
