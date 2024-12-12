
const mongoose = require('mongoose');

const privacySchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
  });
  
  const Privacy = mongoose.model('Privacy', privacySchema);
  module.exports = Privacy;
  