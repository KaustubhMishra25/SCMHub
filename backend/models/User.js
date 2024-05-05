const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

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
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        // hash the password using our new salt
        const hash = await bcrypt.hash(user.password, salt);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Compare candidate password with hashed password in the database
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        // Explicitly return the comparison result
        return isMatch;
    } catch (error) {
        // Handle potential errors during password comparison
        console.error('Error comparing passwords:', error);
        // You can throw a specific error or return a specific value here
        // depending on your application logic (e.g., return false)
        return false;
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
