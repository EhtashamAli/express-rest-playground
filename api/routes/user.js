const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup' , (req , res , next) => {
    User.find({email : req.body.email}).exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message : "Email Already Exists"
            });
        }
        bcrypt.hash(req.body.password , 10 , (err , hash) => {
            if(err) {
                return res.status(500).json({
                    message : err
                });
            } else {
                const user = new User({
                    _id : new mongoose.Types.ObjectId(),
                    email : req.body.email,
                    password : hash 
                })

                user.save()
                .then(result => {
                    res.status(200).json({
                        RESULT : result
                    })
                })
                .catch(err => {
                    ERROR :err
                });
            } 
        })
    })
});

module.exports = router;