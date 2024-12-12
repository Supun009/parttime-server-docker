const { ConnectionStates } = require('mongoose');
const User = require('../models/authModels/userModel');



const jobLimit = async (req, res, next)=> {
    try {

        const user = await User.findById(req.user);
       
       
          // Get the current date
          const currentDate = new Date();

          // Remove job post dates older than 30 days
          user.jobPostDates = user.jobPostDates.filter(
          date => (currentDate - new Date(date)) <= 30 * 24 * 60 * 60 * 1000
             );
         
              if (user.jobPostDates.length > 2) {
                  return res.status(409).json({msg:'Free job post limit exceeded in the last 30 days!'})
              }

        req.currentDate = currentDate;  
        req.user = user;    
        next();

    } catch (e) {
       return  res.status(500).json({error: e.nessage});
    }
}




module.exports = jobLimit;