const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let usersDatabase = [];
let otpStorage = {};

// Send OTP API - Generates OTP and returns it directly to frontend alert
app.post('/api/send-otp', (req, res) => {
    const { contact, type } = req.body;
    
    if (!contact) {
        return res.status(400).json({ success: false, message: "Contact details are required!" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStorage[contact] = otp;

    res.json({ 
        success: true, 
        message: `OTP generated successfully for ${type === 'email' ? 'Gmail' : 'Phone'}!`, 
        otp: otp 
    });
});

// Verify OTP & Register User
app.post('/api/verify-and-register', (req, res) => {
    const { contact, otp, firstName, lastName } = req.body;

    if (!otpStorage[contact] || otpStorage[contact] !== otp) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });
    }

    delete otpStorage[contact];

    const uniqueID = Math.floor(1000000 + Math.random() * 9000000).toString();

    const newUser = {
        userID: uniqueID,
        firstName: firstName,
        lastName: lastName,
        contact: contact,
        verified: true,
        createdAt: new Date()
    };

    usersDatabase.push(newUser);

    res.json({
        success: true,
        message: "Account created successfully!",
        user: newUser
    });
});

// Search User by ID
app.get('/api/search/:id', (req, res) => {
    const searchID = req.params.id;
    const foundUser = usersDatabase.find(u => u.userID === searchID);

    if (foundUser) {
        res.json({ success: true, user: foundUser });
    } else {
        res.status(404).json({ success: false, message: "User not found with ID: " + searchID });
    }
});

// PWA Manifest
app.get('/manifest.json', (req, res) => {
    res.json({
        "name": "Ashiana Cricket",
        "short_name": "Ashiana",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#f3f4f6",
        "theme_color": "#d32f2f",
        "icons": [
            {
                "src": "https://img.icons8.com/color/192/000000/cricket.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "https://img.icons8.com/color/512/000000/cricket.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
