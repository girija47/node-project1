const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect('mongodb+srv://girijagirija23122006_db_user:dXtUGvsSlzrExlXn@cluster0.ng13ue5.mongodb.net/?appName=Cluster0').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

const userschema = new mongoose.Schema({
    name: String,
    mail: String,
    pass: String
});

const User = mongoose.model('User', userschema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/register.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, './public/home.html'));
});

app.post('/register', async (req, res) => {
    try {
        const { name, mail, pass } = req.body;
        console.log(name, mail, pass);

        const hashpass = await bcrypt.hash(pass, 10);

        const newUser = new User({
            name: name,
            mail: mail,
            pass: hashpass
        });
        await newUser.save();

        res.send(` 
            <script>
                alert("Registered successfully!!!");
                window.location.href = '/';
            </script>
        `);
    } catch (error) {
        console.error('Error registering user:', error);
        res.send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { mail, pass } = req.body;

        const userid = await User.findOne({ mail });
        if (!userid) {
            return res.send(`
                <script>
                    alert("User not found");
                    window.location.href = '/';
                </script>
            `);
        }

        const isMatch = await bcrypt.compare(pass, userid.pass);
        if (isMatch) {
            res.send(`
                <script>
                    alert("Login successfully!!!");
                    window.location.href = '/home';
                </script>
            `);
        } else {
            res.send(`
                <script>
                    alert("Invalid password");
                    window.location.href = '/';
                </script>
            `);
        }
    } catch (error) {
        console.error('Error on user id', error);
        res.send('Error on user id');
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});