const mongoose = require('mongoose');

const jobPostScheema = mongoose.Schema({
    email: {
        require : true,
        type: String,
        trim: true,
    },

    title: {
        require:true,
        type: String
    },

    category: {
        require:true,
        type: String
    },
 
    description : {
        require: true,
        type: String,
    },

    salary : {
        require: true,
        type: String,
    },

    location : {
        require: true,
        type: String,
    },

    contactInfo : {
        require: true,
        type: String,
    },
    createdAt: { type: Date, default: Date.now },

    isDeleted: {
        type: Boolean,
        default: false,
      },

    isApproved: {
        type: Boolean,
        default: false,
      },
});

const JobPost = mongoose.model("JobPost", jobPostScheema);

module.exports = JobPost;
