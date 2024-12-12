const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoute = require('./routers/authroute');
const jobRoute = require('./routers/jobRoute');
const menuRoute = require('./routers/menuRoute');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');



const PORT = process.env.PORT || 30092;
const app = express();


const DB= process.env.DB2_URL;

app.use(express.json());
app.use(cors());

app.use(authRoute);
app.use(jobRoute);
app.use(menuRoute);


  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api/password-restore', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'resetpasssword.html'));
    });  

  app.get('/api/account-delete-request', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'deleteaccount.html'));
    });

 app.get('/', (req, res) => {
         res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
       });

// Generate a secure token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Map tokens to user sessions (or store in a database)
const tokenStore = {}; 

app.post('/verify-captcha', async (req, res) => {
    const { response } = req.body;
    const secretKey = '6LeMv0cqAAAAAEoU0PTtBIdLwDvW2Bto4Bzz66SQ'; 

    try {
        const verificationResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${response}`
        });
        const data = await verificationResponse.json();

        if (data.success) {
            // Generate a token
            const token = generateToken();
            // Store the token (e.g., in-memory or database)
            tokenStore[token] = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
            res.json({ success: true, token });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        res.status(500).json({ success: false });
    }
});

app.get('/download/:token', (req, res) => {
    const { token } = req.params;
    const tokenExpiry = tokenStore[token];

    if (tokenExpiry && Date.now() < tokenExpiry) {
        // Serve the file
        const filePath = path.join(__dirname, 'download', 'app', 'parttimejobslk.apk');
        res.download(filePath, 'parttimejobslk.apk', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error downloading file');
            }
            // Optionally, delete the token after use
            delete tokenStore[token];
        });
    } else {
        res.status(403).send('Invalid or expired token');
    }
});
    
app.use((req, res, next) => {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    });  

         

app.listen(PORT, "0.0.0.0", ()=> {
    console.log(`connected at port ${PORT}`);
})

mongoose.connect(DB).then(()=> {
    console.log('DB connected');
}).catch((e)=> {
    console.log(e);
})

