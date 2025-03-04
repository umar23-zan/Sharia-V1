const express = require("express");
const router = express.Router();
const PaymentMethod = require("../models/PaymentMethods");

// Get payment methods for a user
router.get("/:userId", async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.params.userId });
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
});

// Add a new payment method
router.post("/", async (req, res) => {
  try {
    const newPayment = new PaymentMethod(req.body);
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add payment method" });
  }
});

// Set a default payment method
router.put("/default/:id", async (req, res) => {
  try {
    await PaymentMethod.updateMany({ userId: req.body.userId }, { isDefault: false });
    await PaymentMethod.findByIdAndUpdate(req.params.id, { isDefault: true });

    res.json({ message: "Default payment method updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update default method" });
  }
});

// Delete a payment method
router.delete("/:id", async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment method deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payment method" });
  }
});

module.exports = router;
