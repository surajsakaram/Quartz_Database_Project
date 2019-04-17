const authConfig =  require('../config/auth.config');
const jwt = require('jsonwebtoken');
const db  = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {

    tokenValidate : function(token,cb){
        jwt.verify(token, authConfig.jwtSecret, (err, decoded)=> {
            if(err){
                cb(err,false);
            }else{
                db.users.findById(decoded.data,(err,data)=>{
                    if(err){
                        cb(err,false);
                    }
                    else{
                        cb(false,data);
                    }
                });
            }
        });
    },
    genToken: function(id){
        return  jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (86400),
                    data: id
                }, authConfig.jwtSecret);
    },
    genPassword: function(password,cb){
        bcrypt.genSalt(12, function(err, salt) {
            if(err) cb(err,null);
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) cb(err,null);
                cb(false,hash);
            });
        });
    }
//end of object
}