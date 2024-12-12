const express = require('express');
const authRoute = express.Router();
const bcryptjs = require('bcryptjs');
const jwttoken = require('jsonwebtoken');
const auth = require('../middleware/authMiddle');
const User = require('../models/authModels/userModel');
const { generateResetToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const deletedAcc = require('../models/menuModels/deletedAccSchema');
const path = require('path');

const cssStyles = `
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  .container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
  }
  h1 {
    color: #d9534f;
    margin: 0;
    font-size: 1.8em;
  }
  p {
    font-size: 1.2em;
    margin: 15px 0;
  }
  a {
    color: #0275d8;
    text-decoration: none;
    font-size: 1.1em;
  }
  a:hover {
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 1.5em;
    }
    p, a {
      font-size: 1em;
    }
  }
`;


authRoute.post("/api/signup", async (req, res)=> {

    try {
 
        const {name, email ,password, jobIds} = req.body;

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email address" });
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({ msg: "Password must be between 6 and 20 characters long" });
        }

        const existUser = await User.findOne({email});
       if (existUser) {
        if (existUser.isDeleted) {
            return res.status(400).json({msg: "User with same email already has deleted account, please contact the help center.."});
        }
        return res.status(400).json({msg: "User with same email already exists"});
       }
       

        const hashedPassword = await bcryptjs.hash(password, 8);
       
        let user = User({
            name, email , password:hashedPassword, jobIds, isVerified: false, verificationToken: crypto.randomBytes(20).toString('hex')
        });
        user = await user.save();
        
        const verificationLink = `https://parttimejobs.web.lk/api/verify-email?token=${user.verificationToken}`;
   

        const message = `
        <h1>Email veryfication request</h1>
        <p>Please verify your email by clicking this link: </p>
        <a href="${verificationLink}" clicktracking=off>${verificationLink}</a>
    `;

        await sendEmail({
            to:user.email,
            subject: 'Email Verification',
            html: message,
        })

        res.status(200).json({msg : 'User sign up successfully, Please check your email to verify your account.'});
    } catch (e) {

        res.status(500).json({error: e.message});
    }
});


authRoute.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;

     if (!token) {
        return res.status(400).send(`
            <html>
              <head>
                <style>${cssStyles}</style>
              </head>
              <body>
                <h1>Bad Request</h1>
                <p>No verification token provided.</p>
              </body>
            </html>
        `);
    }
  
      try {
        // Find user with the provided token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).send(`
                <html>
                  <head>
                    <style>${cssStyles}</style>
                  </head>
                  <body>
                    <h1>Email Verification Failed</h1>
                    <p>Invalid token or user not found.</p>
                  </body>
                </html>
            `);
        }

        // Verify the user's email
        user.isVerified = true;
        user.verificationToken = null; // Clear token
        await user.save();

        return res.status(200).send(`
            <html>
              <head>
               <style>${cssStyles}</style>
              </head>
              <body>
                <h1>Email Successfully Verified!</h1>
                <p>You can now log in to your account.</p>
              
              </body>
            </html>
        `);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

authRoute.post("/api/signin", async (req, res)=> {
 
    try {
        
        const {email ,password} = req.body;

        const user = await User.findOne({email, isDeleted: false, isVerified: true });
        if (!user) {
            return res.status(400).json({msg: "Email or password incorrect, please check and try again"});
        }

        const isMatched = await bcryptjs.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({msg: "Incorrect password"});
        }
        const token = jwttoken.sign({id: user._id}, "passwordjwtkey");
        res.json({token,  ...user._doc});

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


authRoute.delete('/api/delete-account', auth, async (req, res) => {
    try {

      const userId = req.user; 
      const { reason } = req.body;
  
      let deletedAccount = new deletedAcc({
        reason,
        uid: userId
    });
      

      deletedAccount = await deletedAccount.save();

       // Directly update the user's `isDeleted` flag in the database
       await User.findByIdAndUpdate(userId, { isDeleted: true });
  
      res.status(200).json({ msg: 'Account deleted successfully!' });
    } catch (e) {
      
      res.status(500).json({ error: e.message });
    }
  });

//get user data
authRoute.get('/api/user', auth, async (req, res)=> {
    try {
        const user =await User.findOne({_id:req.user, isDeleted: false});
    
    if (!user) {
        return res.status(404).json({ msg: 'User not found please login'});
    }
    res.status(200).json({...user._doc});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRoute.post('/api/request-reset-password', async (req, res) => {
    try {

        const { email } = req.body;

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email address" });
        }
    
        
        const user = await User.findOne({ email , isDeleted: false});


        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const now = new Date();
        user.resetRequestTimestamps = user.resetRequestTimestamps.filter(timestamp => {
            const timeDifference = (now - new Date(timestamp)) / (1000 * 60 * 60); // hours
            return timeDifference < 24;
        });

        // Check if the user has exceeded the limit of 3 requests in the last 24 hours
        if (user.resetRequestTimestamps.length >= 3) {
            return res.status(429).json({ msg: 'You have exceeded the limit of 3 password reset requests per day. Please try again later.' });
        }

        const resetToken = generateResetToken(user._id);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        // Update the reset request count and timestamps
        user.resetRequestTimestamps.push(now);
        user.resetRequestCount = user.resetRequestTimestamps.length;
        await user.save();
  
       
        const resetUrl = `https://parttimejobs.web.lk/api/password-restore?token=${resetToken}`;
        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click on the following link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;


        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        });

        res.status(200).json({ msg: 'Password reset link sent' });

    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});


authRoute.put('/api/reset-password/:token', async (req, res) => {
    try {
       
        const { token } = req.params;
        const { password } = req.body;
        
       
        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({ msg: "Password must be between 6 and 20 characters long" });
        }

        const hashedToken = token;
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });



        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        const hashedPassword = await bcryptjs.hash(password, 8);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password reset successful' });

    } catch (e) {
     
        res.status(500).json({ error: e.message });
    }
});

module.exports = authRoute;