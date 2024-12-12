const mongoose = require('mongoose');


const DeletedAccountSchema =  mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
  }
});

const deletedAcc = mongoose.model('DeletedAccount', DeletedAccountSchema);

module.exports = deletedAcc;
