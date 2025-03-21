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

      const watchlistLimits = { free: 0, basic: 10, premium: 25 };
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
// Add this route to delete a specific stock from a user's watchlist
router.delete('/:userId/:symbol', async (req, res) => {
    const { userId, symbol } = req.params;
    
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if the stock exists in the watchlist
      const stockIndex = user.watchlist.findIndex(item => item.symbol === symbol);
      
      if (stockIndex === -1) {
        return res.status(404).json({ error: "Stock not found in watchlist" });
      }
      
      // Remove the stock from the watchlist
      user.watchlist.splice(stockIndex, 1);
      await user.save();
      
      res.json({ 
        message: "Stock removed from watchlist", 
        symbol: symbol,
        watchlist: user.watchlist 
      });
      
    } catch (error) {
      console.error("Error removing stock from watchlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;
