const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Contact Us'
  },
  description: {
    type: String,
    required: true
  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;