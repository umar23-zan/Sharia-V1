const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const User = require('../models/User');

const MONGO_URI = "mongodb+srv://umar:umar444@authentication-app.ted5m.mongodb.net/";
const DATABASE_NAME = "authdb";
const COLLECTION_NAME = "StockData";
const USER_COLLECTION = "users";

const checkSubscription = async (req, res, next) => {
        const userId = req.query.userId; 
    
        if (!userId) {
            return res.status(401).json({ message: "User ID is required" });
        }
    
        let client;
        try {
            client = await MongoClient.connect(MONGO_URI);
            const db = client.db(DATABASE_NAME);
            const user = await db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(userId) });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            
            const subscriptionPlan = user.subscription?.plan || 'free';
    
            if (subscriptionPlan === 'basic' || subscriptionPlan === 'premium') {
               
                if (user.subscription?.status === 'active' && user.subscription?.endDate && new Date(user.subscription.endDate) < new Date()) {
                   
                    await db.collection(USER_COLLECTION).updateOne(
                        { _id: new ObjectId(userId) },
                        {
                            $set: {
                                'subscription.status': 'inactive', 
                                viewedStockIds: [],
                                stockResultsViewsCount: 0
                            }
                        }
                    );
                    return res.status(403).json({ message: "Subscription expired. Please renew to continue viewing stocks." });
                }
                return next();
            } else if (subscriptionPlan === 'free') {
                
    
                if (!user.viewedStockIds) {
                    await db.collection(USER_COLLECTION).updateOne(
                        { _id: new ObjectId(userId) },
                        { $set: { viewedStockIds: [], stockResultsViewsCount: 0 } }
                    );
                }
                if (user.viewedStockIds.length >= 3) {
                    return res.status(403).json({ message: "Stock view limit reached for free plan. Please subscribe to view more." });
                }
                next();
            } else {
               
                return res.status(400).json({ message: "Invalid subscription plan." });
            }
    
        } catch (error) {
            console.error("Error checking subscription:", error);
            res.status(500).json({ message: "Error verifying subscription" });
        } finally {
            if (client) client.close();
        }
    };


router.get('/all', async (req, res) => {
  let client;
  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME).find({}).toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching stocks:', error);
      res.status(500).json({ message: 'Error fetching stocks data' });
  } finally {
      if (client) client.close();
  }
});

router.get('/:symbol', async (req, res) => {
    const { userId } = req.query;
    const symbol = req.params.symbol.toUpperCase();
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
  
    const planLimits = { free: 3, basic: Infinity, premium: Infinity };
    if (user.subscription.plan === 'free') {
      if (user.searchedStocks.length >= planLimits.free && !user.searchedStocks.includes(symbol)) {
          return res.status(403).json({ error: "Search limit exceeded" });
      }
  }
  
    let client;
    try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      
      const stock = await db.collection(COLLECTION_NAME)
        .findOne({ SYMBOL: symbol });
      
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
      
      if (!user.searchedStocks.includes(symbol)) {
        user.searchedStocks.push(symbol);
        await user.save();
    }
      
      res.json(stock);
    } catch (error) {
      console.error('Error fetching stock:', error);
      res.status(500).json({ message: 'Error fetching stock data' });
    } finally {
      if (client) client.close();
    }
  });


router.get('/filter/halal-high-confidence', async (req, res) => {
  let client;
  
  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME)
          .find({ Initial_Classification: "Halal", Shariah_Confidence_Percentage: 100})
          .toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching high-confidence Halal stocks:', error);
      res.status(500).json({ message: 'Error fetching high-confidence Halal stocks' });
  } finally {
      if (client) client.close();
  }
});

router.get('/filter/sector', async (req, res) => {
  const { sector } = req.query; 
  let client;

  try {
      client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DATABASE_NAME);
      const stocks = await db.collection(COLLECTION_NAME)
          .find({ Sector: sector })
          .toArray();
      res.json(stocks);
  } catch (error) {
      console.error('Error fetching stocks by sector:', error);
      res.status(500).json({ message: 'Error fetching stocks by sector' });
  } finally {
      if (client) client.close();
  }
});


router.get('/filter/industries', async (req, res) => {
    const { industries } = req.query;
    let client;
  
    try {
        client = await MongoClient.connect(MONGO_URI);
        const db = client.db(DATABASE_NAME);
        
        const industryArray = industries ? industries.split(',') : [];
        const filter = industryArray.length > 0 ? { Industry: { $in: industryArray } } : {};
  
        const stocks = await db.collection(COLLECTION_NAME).find(filter).toArray();
        
        if (!stocks.length) {
            return res.status(404).json({ message: "No stocks found for the provided industries." });
        }
  
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks by multiple industries:', error);
        res.status(500).json({ message: 'Error fetching stocks by multiple industries' });
    } finally {
        if (client) client.close();
    }
  });

  router.get('/filter/industries-sectors', async (req, res) => {
    const { industries, sectors } = req.query; 
    let client;
  
    try {
        client = await MongoClient.connect(MONGO_URI);
        const db = client.db(DATABASE_NAME);
        
        const industryArray = industries ? industries.split(',') : [];
        const sectorArray = sectors ? sectors.split(',') : [];
  
        const filter = {};
        if (industryArray.length > 0) {
            filter.Industry = { $in: industryArray };
        }
        if (sectorArray.length > 0) {
            filter.Sector = { $in: sectorArray };
        }
  
        const stocks = await db.collection(COLLECTION_NAME).find(filter).toArray();
        
        if (!stocks.length) {
            return res.status(404).json({ message: "No stocks found for the provided industries or sectors." });
        }
  
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks by multiple industries and sectors:', error);
        res.status(500).json({ message: 'Error fetching stocks by multiple industries and sectors' });
    } finally {
        if (client) client.close();
    }
  });



module.exports = router;