const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./model/user');
const formdata = require('./model/std');
const adminaccess = require('./router/admin');
const crudrouter = require('./router/store');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//session create
app.use(session({
    secret: 'batch2312',
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection
mongoose.connect('mongodb+srv://girijagirija23122006_db_user:OwUWW1NXHms7Hm3F@cluster0.dhcdybz.mongodb.net/?appName=Cluster0').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// User Schema
// const userschema = new mongoose.Schema({
//     name: String,
//     mail: String,
//     pass: String
// });

// const User = mongoose.model('User', userschema);

//add data
// const userdata = new mongoose.Schema({
//     userid: String,
//     name: String,
//     age: Number,
//     gender: String,
//     fname: String,
//     mname: String, 
//     num: String,
//     email: String,
//     pass: String,
//     district: String,
//     state: String
// });

// const formdata = mongoose.model('formdata', userdata);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/register.html'));
});

app.get('/home', (req, res) => {
    if(!req.session.userId){
        return res.send(`
            <script>
                alert("You Are Not Login.So, Please login first");
                window.location.href = '/';
            </script>
        `);
    }else{
  res.sendFile(path.join(__dirname, './public/read.html'));
    }
});

app.get('/add-user', (req, res) => {
    if(!req.session.userId){
        return res.send(`
            <script>
                alert("You Are Not Login.So, Please login first");
                window.location.href = '/';
            </script>
        `);
    }else{
  res.sendFile(path.join(__dirname, './public/add.html'));
    }
});

app.get('/edit', (req, res) => {
    if(!req.session.userId){
        return res.send(`
            <script>
                alert("You Are Not Login.So, Please login first");
                window.location.href = '/';
            </script>
        `);
    }else{
  res.sendFile(path.join(__dirname, './public/edit.html'));
    }
});

//login and register route handle
app.use('/acc', adminaccess);

// Use CRUD Router
app.use('/crud', crudrouter);

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send(`
        <script>
            alert("Logged out successfully");
            window.location.href = '/';
        </script>
    `);
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});