const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name:String,
    description:String
});

module.exports = mongoose.model('groups',groupSchema); 