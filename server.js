const express = require('express');
const cors = require('cors');

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

// PWA Manifest Endpoint for PWABuilder
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

// Root URL par direct Frontend App aur Manifest link
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ashiana Cricket</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#d32f2f">
    <style>
        :root {
            --primary-red: #d32f2f;
            --bg-light: #f3f4f6;
            --card-bg: #ffffff;
            --text-dark: #111827;
            --text-muted: #6b7280;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        body {
            background-color: var(--bg-light);
            color: var(--text-dark);
            padding-bottom: 90px;
        }
        header {
            background: #ffffff;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .brand-title {
            font-size: 18px;
            font-weight: 900;
            color: #000;
        }
        .header-icons {
            display: flex;
            gap: 14px;
            font-size: 18px;
            align-items: center;
            cursor: pointer;
        }
        .container {
            padding: 16px;
        }
        .search-box {
            display: flex
