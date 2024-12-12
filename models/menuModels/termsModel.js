const mongoose = require('mongoose');

const termsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
  });
  
  const Terms = mongoose.model('Terms', termsSchema);
  module.exports = Terms;
  