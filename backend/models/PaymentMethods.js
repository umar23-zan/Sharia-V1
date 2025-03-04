const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Visa", "Mastercard", "UPI"], required: true },
  category: { type: String, enum: ["card", "upi"], required: true },
  label: { type: String },
  number: { type: String }, // Store only the last 4 digits for security
  expires: { type: String },
  upiId: { type: String },
  isDefault: { type: Boolean, default: false },
  color: { type: String },
});

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
module.exports = PaymentMethod;
