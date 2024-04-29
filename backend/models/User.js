const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const { object } = require('prop-types');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    business_details: {
        type: Object,
    }
});

userSchema.pre('save', async function(next) {
    try {
        // Check if the password has been modified or is new
        if (!this.isModified('password')) {
            return next();
        }

        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace plain text password with hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Compare candidate password with hashed password in the database
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
