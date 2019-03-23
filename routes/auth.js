var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/signup', function (req, res, next) {
    var user = new User({
        fullName: req.body.fullName,
        dateOfBirth: req.body.dateOfBirth,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        isAdmin: false
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'User was not created',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/signin', function(req, res, next) {
    User.findOne({userName: req.body.userName}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if(user){
            var token = jwt.sign({user: user}, 'secrettoken', {expiresIn: 7200});
            console.log(user);
            if(user.isAdmin){
                return res.status(200).json({
                    message: 'Admin log in success',
                    token: token,
                    userName: user.userName,
                    isAdmin: true
                });
            }
            return res.status(200).json({
                message: 'Successfully logged in',
                token: token,
                userName: user.userName,
                isAdmin: false
            });
        }
    });
});

module.exports = router;
