const mongoose = require('mongoose');

const appVersionSchema = mongoose.Schema({
    version: { type: String, required: true },
    releaseDate: { type: Date, required: true }
  });
  
  const AppVersion = mongoose.model('AppVersion', appVersionSchema);
  module.exports = AppVersion;
  