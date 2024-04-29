// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    // Create new user account and store business details in database
    try {
        // Create user account
        const newUser = await User.create({ email: req.body.email, password: req.body.password, business_details: req.body.businessDetails });

        res.status(201).json({ success: true, message: 'User account created successfully' });
    } catch (error) {
        console.error('Error creating user account:', error);
        res.status(500).json({ success: false, message: 'Error creating user account' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        res.status(200).json({ success: true, message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

module.exports = router;
