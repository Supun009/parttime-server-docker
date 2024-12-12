const mongoose = require('mongoose');

const faqScheema = mongoose.Schema({

    title: {
        require:true,
        type: String
    },

    description: {
        require : true,
        type: String,
       
    },

  
 
   
});

const FAQ = mongoose.model("faqs", faqScheema);

module.exports = FAQ;
