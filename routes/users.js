const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


//POST route for creating a new user
router.post('/create', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        //Input Validation
        if (!name) {
            return res.status(400).json({ error: "please provide a name" });
        }
        if (!email) {
            return res.status(400).json({ error: "please provide an email" });
        }
        if (!password) {
            return res.status(400).json({ error: "please provide a password" });
        }

        // Check if the email already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email Already Exists!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        let securePassword = await bcrypt.hash(password, salt);

        // Create the user
        user = await userModel.create({
            name, email, password: securePassword
        })

        // Generate JWT token
        let data = {
            user: {
                id: user._id
            }
        }
        const authtoken = jwt.sign(data, jwtSecret);

        // Respond with a consistent format
        res.status(201).json({ message: "User created successfully!", success: true, authtoken });
    } catch (error) {
        console.error("error creating user: ", error);
        res.status(500).json({ error: "internal server error" });
    }
})

//POST route for login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        //Input Validation
        if (!email) {
            return res.status(400).json({ error: "Please provide an email!" });
        }
        if (!password) {
            return res.status(400).json({ error: "Please provide a password!" });
        }

        //Check if user exists for the given email
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please provide valid credentials!" });
        }
        //verify the password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({ error: "Please provide valid credentials!" });
        }

        // Generate JWT token
        let data = {
            user: {
                id: user._id
            }
        }
        const authtoken = jwt.sign(data, jwtSecret);

        // Respond with a consistent format
        res.status(200).json({ message: "User logged in successfully!", success: true, authtoken });
    } catch (error) {
        console.error("error logging in user: ", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
})

module.exports = router;