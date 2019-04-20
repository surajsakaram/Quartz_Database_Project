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
                db.users.findById(decoded.data).populate('groupId').exec((err,data)=>{
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
    },
    login : function(data,cb){
        
        var ths = this;
        db.users.findOne({"email":data.email},(err,edata)=>{
            if(err){
                cb(err,null);
            }
            else if(edata === null){
                cb("invalid_email",null);
            }
            else{
                bcrypt.compare(data.password, edata.password, function(err, res) {
                    if(err){
                        cb(err,null);
                    }
                    if(res){
                        db.users.updateOne({_id:edata._id},{lastLogin:Math.floor(Date.now()/1000)},(err,udata)=>{
                            if(err){
                                cb(err,null);
                            }
                            else{
                                const token = ths.genToken(edata._id);
                                cb(false,token);
                            }
                        });
                        
                    }
                    else{
                        cb("invalid_password",null);
                    }
                });
            }
        });
    },
//end of object
}