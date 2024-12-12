const express = require('express');
const jobRoute = express.Router();
const auth = require('../middleware/authMiddle');
const jobLimit = require('../middleware/jobLimitMiddle');
const JobPost = require('../models/jobModels/jobModel');
const User = require('../models/authModels/userModel');
const JobReport = require('../models/menuModels/jobReportSchema');
const Category = require('../models/categoryModel/categoryModel');

jobRoute.post('/api/uploadjob', auth, jobLimit, async(req, res)=> {
    try {
        const { title, category, description, salary, location, contactInfo } = req.body;

        const currentDate = req.currentDate;
        const user = await User.findById(req.user);
        const email = user.email;
   
   

            let job = JobPost({
                email, title, category, description, salary, location, contactInfo,
            });
         
            job = await job.save();
            if (!user.jobIds) {
              user.jobIds = [];
            }
           
            user.jobIds.push(job._id);
            user.jobPostDates.push(currentDate);
            await user.save();

            return res.status(200).json({msg:'Job posted successfully!'})

    } catch (e) {
   
            res.status(500).json({error: e.message});
    }
});

jobRoute.put('/api/editjob', auth, async (req, res) => {
  try {

      const { title, category, description, salary, location, contactInfo } = req.body;

   
      const jobId = req.query.id;
    

  
      const job = await JobPost.findById(jobId);

     
      if (!job) {
          return res.status(404).json({ msg: 'Job not found' });
      }

   
      job.title = title || job.title;
      job.category = category || job.category;
      job.description = description || job.description;
      job.salary = salary || job.salary;
      job.location = location || job.location;
      job.contactInfo = contactInfo || job.contactInfo;

     
      await job.save();

      return res.status(200).json({ msg: 'Save changes successfully!' });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});


jobRoute.get('/api/alljob', auth, async(req,res)=> {
    try {
      const jobList = await JobPost.find({isDeleted: false, isApproved: true}).sort({ createdAt: -1 }).exec();

   if (jobList.length === 0) {
    return res.status(404).json({ msg: 'No jobs found' });
  }
 
        res.status(200).json(jobList);
    } catch (e) {
    
        res.status(500).json({error: e.message});
    }
});

jobRoute.get('/api/categories', async(req, res) => {
  try {
    const categoryList = await Category.find({}).sort({title: 1});

    if (categoryList.length == 0) {
     return res.status(404).json({msg: 'Categories not found'});
    }

    res.status(200).json(categoryList);

  } catch (e) {
    res.status(500).json({error : e.message});
  }
});

// jobRoute.delete('/jobs', async (req, res) => {
//   try {
//     const result = await JobPost.deleteMany({});
//     res.json({ message: 'All jobs deleted', result });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

jobRoute.delete('/api/jobs-delete', auth, async (req, res) => {
  try {
    const jobId = req.query.id;
    
    const updatedJob = await JobPost.findByIdAndUpdate(
      jobId,
      { isDeleted: true },
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ msg: 'Job not found' }); 
    }
    res.status(200).json({ msg: 'Job deleted successfully!'});
  } catch (e) {

    res.status(500).json({error: e.message});
  }
});


  jobRoute.get('/api/user-jobs', async (req, res) => {
   
    const email = req.query.userEmail
   
    try {
      const jobs = await JobPost.find({ email, isDeleted: false }).sort({ createdAt: -1 }).exec();
      if (jobs.length === 0) {
        return res.status(404).json({ msg: 'No jobs found' });
      }
    
      res.status(200).json(jobs);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  });


  jobRoute.get('/api/searchjobs', auth, async (req, res) => {
    try {
      
      const searchTerm = req.query.q;
      if (!searchTerm) {
        return res.status(400).json({ msg: 'Search term is required' });
      }
  
     
      const jobs = await JobPost.find({isDeleted: false,
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          // { description: { $regex: searchTerm, $options: 'i' } },
          { location: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ],
      }).sort({ createdAt: -1 });
      
      if (jobs.length === 0) {
        return res.status(404).json({ msg: 'No jobs found' });
      }
  
      res.status(200).json(jobs);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


  jobRoute.post('/api/report-job', async (req, res) => {
  try {
    const { jobId, userId, reason } = req.body;

    const newReport = new JobReport({
      jobId,
      userId,
      reason
    });

    await newReport.save();

    res.status(201).json({ msg: 'Job reported successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



  

module.exports = jobRoute;