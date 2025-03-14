const express = require('express');
const router = express.Router();

const User = require('../models/User');
const PlanConfig = require('../models/PlanConfig');

router.get('/plans', async (req, res) => {
  try {
    const plans = await PlanConfig.find({ isActive: true });

    // Create a lookup map for quick access
    const planMap = plans.reduce((acc, plan) => {
      acc[plan.planId] = plan;
      return acc;
    }, {});

    // Format plans with default values if missing
    const formattedPlans = {
      free: {
        monthly: planMap.free?.prices?.monthly || 0,
        annual: planMap.free?.prices?.annual || 0,
      },
      basic: {
        monthly: planMap.basic?.prices?.monthly || 299,
        annual: planMap.basic?.prices?.annual || 3048,
      },
      premium: {
        monthly: planMap.premium?.prices?.monthly || 599,
        annual: planMap.premium?.prices?.annual || 6110,
      }
    };

    // Default plan features (fallback if database doesn't provide them)
    const defaultFeatures = {
      free: [
        'Search up to 3 stocks',
        'Basic Shariah compliance details',
        'Limited market insights',
        'No stock storage',
        'No notifications',
      ],
      basic: [
        'Search and analyze all stocks',
        'Store up to 10 stocks',
        'News notifications for stored stocks',
        'Detailed Shariah compliance metrics',
        
      ],
      premium: [
        'Search and analyze all stocks',
        'Store up to 25 stocks',
        'Priority news notifications',
        'Expert Shariah compliance insights',
        
      ],
    };

    // Map plan features from DB, use defaults if missing
    const planFeatures = {
      free: planMap.free?.features || defaultFeatures.free,
      basic: planMap.basic?.features || defaultFeatures.basic,
      premium: planMap.premium?.features || defaultFeatures.premium,
    };

    res.json({
      planPrices: formattedPlans,
      planFeatures,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.get('/current', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findById(req.query.userId).select('subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/change', async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;
    
   
    if (!['free', 'basic', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }
    
   
    const user = await User.findById(req.query.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    
    if (plan === 'free' && user.savedStocks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot downgrade to free plan with saved stocks. Please remove saved stocks first.' 
      });
    }
    
    
    if (user.subscription.plan === plan && user.subscription.billingCycle === billingCycle) {
      return res.status(400).json({ message: 'You are already subscribed to this plan' });
    }
    

    res.json({
      currentPlan: user.subscription.plan,
      newPlan: plan,
      billingCycle,
      requiresPayment: plan !== 'free',
      nextStep: plan === 'free' ? 'update' : 'payment'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/cancel', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only can cancel paid plans
    if (user.subscription.plan === 'free') {
      return res.status(400).json({ message: 'You are not currently on a paid plan' });
    }
    
    // Update subscription to disable auto-renewal
    user.subscription.autoRenew = false;
    await user.save();
    
    res.json({ 
      message: 'Subscription will be canceled at the end of the current billing period',
      subscription: user.subscription
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/update', async (req, res) => {
  try {
    const { plan, billingCycle, transactionId } = req.body;
    
   
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Update subscription
    user.subscription = {
      plan,
      billingCycle,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true
    };
    
    await user.save();
    
    res.json({
      message: 'Subscription updated successfully',
      subscription: user.subscription
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;