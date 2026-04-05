const mongoose = require('mongoose');

// User Schema
const userschema = new mongoose.Schema({
    name: String,
    mail: String,
    pass: String
});

const User = mongoose.model('User', userschema);

module.exports = User;