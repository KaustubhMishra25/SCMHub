const express = require('express');
const User = require('./user_schema');

const router = express.Router()

// Route to register a new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registering user:', req.body);
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add more routes for login, fetching user details, etc.

module.exports = router;
