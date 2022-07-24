const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/book');

router.get("/", (req, res, next) => {
    res.json({
        message: "Books - GET"
    });
})

router.post("/", (req, res, next) => {

    Book.find({
        title: req.body.title,
        author: req.body.author
    })
    .exec()
    .then(result => {
        console.log(result);
        if (result.length > 0) {
            return res.status(406).json({
                message: "Book is already in the catalog"
            })
        }

        const newBook = new Book({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            author: req.body.author
        });
    
        // write to the db
        newBook.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: "Book Saved",
                    book:{
                        title: result.title,
                        author: result.author,
                        id: result._id,
                        metadata:{
                            method: req.method,
                            host: req.hostname
                        }
                    }
                })
            })
            .catch(err=>{
                console.log(err.message);
                res.status(500).json({
                    error: {
                        message: err.message
                    }
                })
            })
        })
    })

router.get("/:BookId", (req, res, next) => {
    const bookId = req.params.bookId;
    
    Book.findById(bookId)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Book Found",
                book:{
                    title: result.title,
                    author: result.author,
                    id: result._id,
                    metadata:{
                        method: req.method,
                        host: req.hostname
                        }
                    }
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
})

router.patch("/:bookId", (req, res, next) => {
    const bookId = req.params.bookId;
    
    const updatedbook = {
        title: req.body.title,
        author: req.body.author
    };

    Book.updateOne({
        _id: bookId
    }, {
        $set: updatedbook
    }).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Book Updated",
            book:{
                title: result.title,
                author: result.author,
                id: result._id,
                metadata:{
                    method: req.method,
                    host: req.hostname
                }
            }
    })
    }).catch(err=>{
        console.log(err.message);
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
})

router.delete("/:bookId", (req, res, next) => {
    const bookId = req.params.bookId;
    Book.deleteOne({
        _id: bookId
    })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Book Deleted",
            book:{
                title: result.title,
            }
        })
    })
    .catch(err=>{
        console.log(err.message);
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
})


module.exports = router;