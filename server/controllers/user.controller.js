const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
var multer = require('multer');
const User = mongoose.model('User');
const Moment = mongoose.model('Moment')

module.exports.register = (req, res, next) => {
    console.log("Heloooooooooo");
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.mobileNumber = req.body.mobileNumber;
    user.city = req.body.city;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.saveMoment = (req, res, next) => {
    var moment = new Moment();
    moment.filePath = req.body.filePath;
    moment.title = req.body.title;
    moment.tag = req.body.tag;
    moment.userId = req.body.userId;
  
    moment.save((err, doc) => {
        if (!err)
            res.status(200).send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname)
    }
})
  
var upload = multer({ storage: storage }).array('userfiles', 10);

module.exports.fileupload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(500).json(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(500).json(err);
        }
        
        let uploadedFiles = [];
        for(let item of req.files) {
            uploadedFiles.push({filename: item.originalname});

        }
        //console.log(uploadedFiles);

        // Everything went fine.
        res.json({progress: 100, files: uploadedFiles});
    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}

module.exports.userList = (req, res, next) =>{
    Moment.find({'userId' : req.body.userId},
        (err, users) => {
            console.log(users)
            if (!users)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.send(users).status(200);
        }
    );
}

