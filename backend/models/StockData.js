const mongoose = require('mongoose');

const StockDataSchema = new mongoose.Schema({
  SYMBOL: {
    type: String,
    required: true
  },
  Sector: {
    type: String,
    required: true
  },
  Industry: { // Added Industry field
    type: String
  },
  Initial_classification: { // Corrected case to lowercase 'c' - consistent with routes
    type: String,
    required: true, // Keep required: true if it's essential for your queries
    alias: 'Initial_Classification' // Mongoose alias to map to 'Initial_Classification' in DB if needed
  },
  Shariah_Confidence_Score: { // Added Shariah_Confidence_Score field
    type: Number
  },
  Shariah_Confidence_Percentage: { // Added Shariah_Confidence_Percentage field
    type: Number
  },
  Haram_Reason: { // Added Haram_Reason field
    type: String
  },
  Debt_to_Assets: { // Added Debt_to_Assets field
    type: Number
  },
  Interest_Income_to_Revenue: { // Added Interest_Income_to_Revenue field
    type: Number
  },
  Cash_and_Interest_Securities_to_Assets: { // Added Cash_and_Interest_Securities_to_Assets field
    type: Number
  },
  Receivables_to_Assets: { // Added Receivables_to_Assets field
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StockData', StockDataSchema);