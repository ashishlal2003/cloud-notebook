const express = require('express');
const router = express.Router();
const userdetail = require('../middlewares/userdetail');
const {body, validationResult} = require('express-validator');
const Notes = require('../models/Notes');

//Fetch all notes of the user
router.get('/fetchallnotes', userdetail, async (req, res) => {
    try {
        // console.log(1);
        const notes = await Notes.find({ user: req.user._id });
        // console.log(req.user);
        // console.log(notes);
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Add Notes
router.get('/addnote', userdetail, [
    body("title","Enter a valid title").isLength({ min:3 }),
    body("description","Enter a valid description with min 5 chars").isLength({ min:5 }),
], async(req, res) => {
    //for any errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const{title, description, tag} = req.body;

        const note = new Notes({title, description, tag, user:req.user._id});

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({err: error.message});
    }

    
})

//Update a note : Login required
router.put('/updatenote/:id', userdetail, async(req,res) => {
    const {title, description, tag} = req.body;
    const newNote = {};

    if(title){
        newNote.title = title;
    }
    if(description){
        newNote.description = description;
    }
    if(tag){
        newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if(!note){
        res.status(404).send("Not Found");
    }

    if(note.user.toString() !== req.user._id){
        return res.status(401).send("Unauthorized");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});

    res.json(note);

});

//Delete a note : login required

router.delete('/deletenote/:id', userdetail, async(req,res)=>{

    let note = await Notes.findById(req.params.id);
    if(!note){
        res.status(404).send("Not Found");
    }

    // console.log(req.user);

    if(note.user.toString() !== req.user._id){
        return res.status(401).send("Unauthorized");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json("Deleted");
});
module.exports = router;