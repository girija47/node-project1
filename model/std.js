const mongoose = require('mongoose');
//add data
const userdata = new mongoose.Schema({
    userid: String,
    name: String,
    age: Number, 
    num: String,
    email: String,
    district: String,
    state: String,
    photo: String
});

const formdata = mongoose.model('formdata', userdata);

module.exports = formdata;