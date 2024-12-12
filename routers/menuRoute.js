const express = require('express');

const menuRoute = express.Router();

const FAQ = require('../models/menuModels/faqModel');
const Terms = require('../models/menuModels/termsModel');
const Privacy = require('../models/menuModels/privacySchema ');
const ContactUs = require('../models/menuModels/contactUsSchema');


menuRoute.get('/api/faq', async(req,res)=> {
    try {


        const faqList = await FAQ.findOne({});

        if (!faqList) {
            res.status(404).json({msg : 'FAQ not found'})
        }
   
        res.status(200).json(faqList);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

menuRoute.get('/api/privacy', async(req,res)=> {
    try {

       
        const privacy = await Privacy.findOne({});
   

        if (!privacy) {
            res.status(404).json({msg : 'privacy not found'})
        }

        res.status(200).json(privacy);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


menuRoute.get('/api/terms-conditions', async(req,res)=> {
    try {

     
        const termsList = await Terms.findOne({
            title : 'Terms and Conditions'});
   
       
        if (!termsList) {
            res.status(404).json({msg : 'Terms conditions not found'})
        }
   
        res.status(200).json(termsList);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

menuRoute.get('/api/contactus', async (req, res) => {
    try {
        const contactUs = await ContactUs.findOne({});
        if (!contactUs) {
            return res.status(404).json({ msg: 'Contact information not found' });
        }
        res.status(200).json(contactUs);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = menuRoute;
