const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = require('../models/author');
const Messages = require('../messages/messages');

router.get("/", (req, res, next) => {
    res.json({
        message: "Authors - GET"
    });
})

router.post("/", (req, res, next) => {
    res.json({
        message: "Authors - POST"
    });
})

router.get("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    Author.findById(authorId)
    .select('name _id')
    .populate('book', 'title author')
    .exec()
    .then(author => {
        if (!author) {
            console.log(author)
            return res.status(404).json({
                message: Messages.AUTHOR_NOT_FOUND
            })
        }

        res.status(201).json({
            author: author
        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
})

router.patch("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    res.json({
        message: "Authors - PATCH",
        id: authorId
    });
})

router.delete("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    
    Author.deleteOne({_id: authorId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Author deleted",
            request: {
                method: req.method,
                url: "http://localhost:3000/authors/" + authorId
            }
        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
})


module.exports = router;