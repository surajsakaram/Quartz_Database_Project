const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    lastLogin:Number,
    createOn:Number,
    password:String,
    active:Boolean,
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'groups'
    }
});

module.exports = mongoose.model('users',usersSchema); 