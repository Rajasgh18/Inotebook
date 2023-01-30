const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "IamRaja";
const fetchUser = require('../middleware/fetchUser');

// Route 1 : Create a User using : Post "/api/auth/createuser". Doesn't require Auth
router.post('/create', [
    body('username', "Enter a valid name").isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //Check whether an user with this email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "Sorry ! A user with this email already exist."})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        let success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// Route 2 : Autheticate a user using : Post "/api/auth/login". Doesn't require Auth
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.arrary() });
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error : "Please try to login with correct email"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error : "Please try to login with correct password"});
        }
        const data = {
            user : {
                id : user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success, authToken});
    } catch(error){
        res.status(500).send("Internal Server Error!");
        console.error(error.message);
    }
})

// Route 3 : Get logined user data using : Post /api/auth/getuser. Login required
router.post('/getuser', fetchUser, async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.json(user);
    } catch(error){
        res.status(500).send("Internal Server Error!")
        console.error({error});
    }
})
module.exports = router;