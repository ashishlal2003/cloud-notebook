const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userdetail = require('../middlewares/userdetail');

const JWT_SECRET = "ThisisaJWTtokenwhichwillsigneveryhting";

//This route does not require authentication
router.post('/createuser', [
    body("name","Enter a valid name").isLength({ min:3 }),
    body("password","Enter a valid password with min 5 chars").isLength({ min:5 }),
    body("email", "Enter a valid email").isEmail(),
],async (req, res) => {

    //for any errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //check if user exists

    try {
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({err: "A user exists with this email"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
    
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user:{
                _id : user._id,
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        
        res.json({authToken});
        
        
    } catch (error) {
        res.status(500).json({err: error.message});
    }

});

//Authenticate a user
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').isLength({min:5}),
], async(req, res)=>{
    //for any errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email: email});

        if(!user){
            return res.status(404).json({error:'Invalid Credentials'});
        }

        const passCompare = await bcrypt.compare(password, user.password);

        if(!passCompare){
            return res.status(404).json({error:'Invalid Credentials'});
        }

        const data = {
            user:{
                _id : user._id,
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        
        res.json({authToken});

    } catch (error) {
        res.status(500).json({err: error.message});
    }
});

//Get user details.. login required
router.post('/getuser', userdetail, async(req, res) => {
    try {
        const userId = req.user._id;
        // console.log(userId);
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).json({err: error.message});
    }
});

module.exports = router;