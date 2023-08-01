const express = require('express');
const router = express.Router();
const User = require('../models/User');

//This route does not require authentication
router.get('/', (req, res) => {
    const user = User(req.body);
    user.save();
    console.log(user);
    res.json(req.body);

});

module.exports = router;