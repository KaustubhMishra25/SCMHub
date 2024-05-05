const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
