const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { strict } = require('assert');

var momentSchema = new mongoose.Schema({
    filePath : String,
    title: String,
    tagging:String,
    userId: String
});

mongoose.model('Moment', momentSchema);