const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');

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
    
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        res.send(req.body);
        
    } catch (error) {
        res.status(500).json({err: error.message});
    }

});

module.exports = router;