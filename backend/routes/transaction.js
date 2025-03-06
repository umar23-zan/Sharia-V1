const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { v4: uuidv4 } = require("uuid");

const dummyCard = {
  cardNumber: "4242 4242 4242 4242",
  expiry: "12/34",
  cvv: "123",
};

router.post("/subscribe", async (req, res) => {
  const { userId, plan, amount, cardDetails, billingCycle } = req.body;

 
  if (
    cardDetails.cardNumber !== dummyCard.cardNumber ||
    cardDetails.expiry !== dummyCard.expiry ||
    cardDetails.cvv !== dummyCard.cvv
  ) {
    return res.status(400).json({ error: "Invalid card details" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactionId = uuidv4();
    const startDate = new Date();
    const expiryDate = new Date();
    if (billingCycle === "annual") {
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
} else {
  expiryDate.setMonth(expiryDate.getMonth() + 1);
}

    const transaction = new Transaction({
      transactionId,
      user: user._id,
      subscriptionPlan: plan,
      amount,
      status: "completed", 
      paymentMethod: "card", 
      paymentDetails: {
        cardBrand: "Visa", 
        last4: "4242", 
      },
      billingCycle, 
    });
    await transaction.save();

    await User.findByIdAndUpdate(userId, {
      subscription: { plan, status: "active", billingCycle, startDate, endDate: expiryDate },
      stockSearchCount: 0,
    });
    res.json({ message: "Subscription activated (mocked)", transactionId });

  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Failed to process subscription" });
  }
});

module.exports = router;