const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post("/", async (req, res) => {
  const { userId, symbol, companyName, stockData } = req.body; 

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const watchlistLimits = { free: 10, basic: 30, premium: 50 };
      if (user.watchlist.length >= watchlistLimits[user.subscription.plan]) {
          return res.status(403).json({ error: "Watchlist limit exceeded" });
      }

      const existingStock = user.watchlist.some(item => item.symbol === symbol);
        if (existingStock) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }
      
      user.watchlist.push({
          symbol: symbol,
          companyName: companyName,
          stockData: stockData
      });

      await user.save();
      res.json({ message: "Stock added to watchlist", watchlist: user.watchlist });

  } catch (error) {
      console.error("Error adding stock to watchlist:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      
      const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


      res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
