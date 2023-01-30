const express = require('express');
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');

// Route 1 : Fetch all notes of logined user using : Get /api/notes/fetchall. Login required
router.get('/fetchall', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const note = await Notes.find({ user: userId });
        res.json(note);
    } catch (error) {
        res.status(500).send("Internal Server Error!");
        console.error(error.message);
    }
})

// Route 2 : Create note of logined user using : Post /api/notes/addnote. Login required
router.post('/addnote', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error.message);
    }
})

// Route 3 : Update note of Logined user using : Put /api/notes/updatenote. Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const {title, description, tag} = req.body;
    // Create a newNote object
    const newNote = {};
    try{
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        
        // Find the note to update and update it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        // Allow only if the user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new:true});
        res.json({note});
    } catch(error){
        res.status(500).send("Internal Sever Error!");
        console.error(error.message);
    }
})

// Route 4 : Delete note of Logined user using : Delete /api/notes/deletenote. Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try{
        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found!");
        }
        // Allow only if the user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Deleted Your Note Successfully!", note:note});
    } catch(error){
        res.status(500).send("Internal Server Error!");
        console.error(error.message);
    }
})

module.exports = router;