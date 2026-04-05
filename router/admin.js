const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, mail, pass } = req.body;
        console.log(name, mail, pass);

        const hashpass = await bcrypt.hash(pass, 10);

        const userid = await User.findOne({ mail });
        if (userid) {
            return res.send(`
                <script>
                    alert("User Already exists So Login Now!!!");
                    window.location.href = '/';
                </script>
            `);
        }

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

// Login Route
router.post('/login', async (req, res) => {
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
            req.session.userId = userid._id;
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

module.exports = router;