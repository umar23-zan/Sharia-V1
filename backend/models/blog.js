const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: String, default: 'Admin' },
  date: { type: Date, default: Date.now },
  content: String,
  faqs: [faqSchema],
});

module.exports = mongoose.model('Blog', blogSchema);
