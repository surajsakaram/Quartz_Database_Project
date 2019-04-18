const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/lobbing",{ useNewUrlParser: true } );

const group   = require('./db.group');
const upload  = require('./db.upload');
const users   = require('./db.user');

module.exports = {
    group   : group,
    users   : users,
    upload   : upload
}