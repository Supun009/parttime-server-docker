const mongoose = require('mongoose');


const aboutUsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
  });
  
  const AboutUs = mongoose.model('AboutUs', aboutUsSchema);
  module.exports = AboutUs;
  