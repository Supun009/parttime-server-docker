const mongoose = require('mongoose');

const CategoryScheema = mongoose.Schema({

    title: {
        require:true,
        type: String
    },

});

const Category = mongoose.model("Category", CategoryScheema);

module.exports = Category;
