const mongoose = require('mongoose');

const contactsSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  });
  
  const Contacts = mongoose.model('Contacts', contactsSchema);
  module.exports = Contacts;
  