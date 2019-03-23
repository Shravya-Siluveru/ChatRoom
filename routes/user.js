var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.get('/', function (req, res, next) {
    User.find({}, function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
    
        res.status(201).json({
            message: 'All users',
            obj: userMap
        });
      });
});

router.get('/profile/:username', function (req, res, next) {
    User.findOne({ 'userName': req.params.username }, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(user){
            res.status(201).json({
                message: 'User details',
                obj: user
            });
        }
    });
});

router.post('/update/:username', function (req, res, next) {
    User.findOne({ 'userName': req.params.username }, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'User not found',
                error: {message: 'Invalid username'}
            });
        }
        User.findOneAndUpdate( { _id: user._id }, { 
            fullName: req.body.fullName,
            dateOfBirth: new Date(req.body.dateOfBirth),
            password: bcrypt.hashSync(req.body.password || user.password, 10),
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender
         },{ returnOriginal: false, new: true },
         function(err, record){
             if(err){
                 console.log(err);
             }
            res.status(201).json({
                message: 'User details updated',
                obj: record
            });
         })
    });
});

router.delete('/delete/:username', function (req, res, next) {
    User.findOneAndRemove({ 'userName': req.params.username }, function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        console.log(result);
        if (result) {
            return res.status(201).json({
                message: 'Removed user succesfully',
                obj: result
            });
        }
    
    });
});


module.exports = router;
