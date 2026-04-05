const express = require('express');
const formdata = require('../model/std.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crudrouter = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // specify the file name
    }
});
    const upload = multer({ storage: storage });

//user data handle crud operations
crudrouter.post('/submit', upload.single('photo'), async (req, res) => {

    const userid = req.session.userId;
    console.log(userid);

    const { name, age, num, email, district, state } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const newData = new formdata({
            userid,
            name,
            age,
            num,
            email,
            district,
            state,
            photo
        });
        await newData.save();

        console.log(`Name: ${name}`);
        console.log(`Age: ${age}`);
        console.log(`Contact Number: ${num}`);
        console.log(`Email: ${email}`);
        console.log(`District: ${district}`);
        console.log(`State: ${state}`);

    res.send(`
        <script>
        alert("Data stored successfully!");
        window.location.href = '/home';
        </script>
        `);
    }catch (error) {
        console.log(error)
    }
}); 

crudrouter.post("/update", upload.single('photo'), async (req, res) => {
    const { id, name, age, gender, fname, mname, num, email, pass, district, state } = req.body;
    let photo = req.file ? req.file.filename : null;  
    const iddata = await formdata.findById(id);

    if (photo && iddata.photo) {
        const oldPhotoPath = path.join(__dirname, './public/upload', iddata.photo);
        if(fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
        }
    }
        if (!photo) {
        photo = iddata.photo;
    }

    await formdata.findByIdAndUpdate(id, {
        name,
        age,
        num,
        email,
        district,
        state,
        photo
    });
    res.send(`
        <script>
        alert("Data updated successfully!");
        window.location.href = '/home';
        </script>
        `);
});
  
    

crudrouter.get('/getdata', async (req, res) => {
    const userid = req.session.userId;
    try {
        const data = await formdata.find({userid: userid});
        res.json(data);
    } catch (error) {
        console.log(error);
    }
});

crudrouter.get("/read/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const userdata = await formdata.findById(id);
        res.json(userdata);
    } catch (error) {
        console.log("error occured", error);
        res.send("error occured", error);
    }
});

crudrouter.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const iddata = await formdata.findById(id);
        const oldPhotoPath = path.join(__dirname, './public/upload', iddata.photo);
        if(fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
        }
        await formdata.findByIdAndDelete(id);
        res.send(`
        deleted successfully
        `);
    } catch (error) {
        console.log("error occured", error);
        res.send("error occured", error);
    }
});

module.exports = crudrouter;