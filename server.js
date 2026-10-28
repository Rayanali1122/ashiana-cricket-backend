const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory database for users
let usersDatabase = [];

// API: Register User & Generate 7-Digit ID
app.post('/api/register', (req, res) => {
    const { name, contact } = req.body;
    
    if (!name || !contact) {
        return res.status(400).json({ success: false, message: "Name and contact are required!" });
    }

    // Generate unique 7-digit ID (e.g., 1037719)
    const uniqueID = Math.floor(1000000 + Math.random() * 9000000);

    const newUser = {
        userID: uniqueID.toString(),
        name: name,
        contact: contact,
        verified: true,
        createdAt: new Date()
    };

    usersDatabase.push(newUser);
    
    res.json({
        success: true,
        message: "User registered successfully!",
        user: newUser
    });
});

// API: Search User by 7-Digit ID
app.get('/api/search/:id', (req, res) => {
    const searchID = req.params.id;
    const foundUser = usersDatabase.find(u => u.userID === searchID);

    if (foundUser) {
        res.json({ success: true, user: foundUser });
    } else {
        res.status(404).json({ success: false, message: "User not found with ID: " + searchID });
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '.')));

app.listen(PORT, () => {
    console.log(`Ashiana Cricket Server is running on port ${PORT}`);
});
  
