const mongoose = require('mongoose');

const userScheema = mongoose.Schema({
    name: {
        require : true,
        type: String,
        trim: true,
    },

    email: {
        require:true,
        type: String,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],

    },
 
    password : {
        require: true,
        type: String,
        minlength: 6,
       
    },

    jobIds : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost'
    }],

    jobPostDates: [{ type: Date }],
    
    isDeleted: {
        type: Boolean,
        default: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    resetRequestTimestamps: {
        type: [Date],
        default: [],
    },
});

const User = mongoose.model("User", userScheema);

module.exports = User;