const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    name:String,
    data:[],
    date:Number,
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
});

module.exports = mongoose.model('uploads',uploadSchema); 