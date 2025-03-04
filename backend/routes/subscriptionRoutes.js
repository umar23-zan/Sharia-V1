const express = require('express');
const router = express.Router();

const User = require('../models/User');
const PlanConfig = require('../models/PlanConfig');

// @route   GET api/subscriptions/plans
// @desc    Get all subscription plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = await PlanConfig.find({ isActive: true });
    
    // Format plans for frontend consumption
    const formattedPlans = {
      free: {
        monthly: plans.find(p => p.planId === 'free')?.prices.monthly || 0,
        annual: plans.find(p => p.planId === 'free')?.prices.annual || 0,
      },
      basic: {
        monthly: plans.find(p => p.planId === 'basic')?.prices.monthly || 299,
        annual: plans.find(p => p.planId === 'basic')?.prices.annual || 3048,
      },
      premium: {
        monthly: plans.find(p => p.planId === 'premium')?.prices.monthly || 599,
        annual: plans.find(p => p.planId === 'premium')?.prices.annual || 6110,
      }
    };

    const planFeatures = {};
    plans.forEach(plan => {
      planFeatures[plan.planId] = plan.features;
    });

    res.json({ 
      planPrices: formattedPlans,
      planFeatures
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subscriptions/current
// @desc    Get current user subscription
// @access  Private
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

// @route   POST api/subscriptions/change
// @desc    Change subscription plan
// @access  Private
router.post('/change', async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;
    
    // Validate inputs
    if (!['free', 'basic', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }
    
    // Find user
    const user = await User.findById(req.query.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If downgrading to free, check stock limits
    if (plan === 'free' && user.savedStocks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot downgrade to free plan with saved stocks. Please remove saved stocks first.' 
      });
    }
    
    // If current plan is already the requested plan with same billing cycle
    if (user.subscription.plan === plan && user.subscription.billingCycle === billingCycle) {
      return res.status(400).json({ message: 'You are already subscribed to this plan' });
    }
    
    // Return the next steps (for payment processing)
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

// @route   POST api/subscriptions/cancel
// @desc    Cancel subscription
// @access  Private
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

// @route   POST api/subscriptions/update
// @desc    Update subscription after payment
// @access  Private
router.post('/update', async (req, res) => {
  try {
    const { plan, billingCycle, transactionId } = req.body;
    
    // This route would be called after successful payment
    // It should be protected and potentially called only by a webhook or internal service
    
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