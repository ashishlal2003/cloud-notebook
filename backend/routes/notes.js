const express = require('express');
const router = express.Router();
const userdetail = require('../middlewares/userdetail');
const Notes = require('../models/Notes');

//Fetch all notes of the user
router.get('/fetchallnotes', userdetail, async (req, res) => {
    try {
        console.log(1);
        const notes = await Notes.find({ user: req.user.id });
        console.log(notes);
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;