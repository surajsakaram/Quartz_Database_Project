const db  = require('../models');
const auth  = require('./auth');
const bcrypt = require('bcryptjs');
module.exports = {

    createUser : (data,cb)=>{
        auth.genPassword(data.password,(err,password)=>{
            if(err){
                cb(err,null);
            }else{
                db.group.findOne({name:"user"},(err,gdata)=>{
                    if(err){
                        cb(err,null);
                    }
                    else{
                        db.users.findOne({"email":data.email},(err,edata)=>{
                            if(err){
                                cb(err,null);
                            }
                            else if(edata._id !== undefined){
                                cb("email",null);
                            }
                            else{
                                db.users.create({
                                    name:data.name,
                                    email:data.email,
                                    password:password,
                                    active:true,
                                    groupId:gdata._id
                                },(err,userdata)=>{
                                    if(err){
                                        cb(err,null);
                                    }
                                    else{
                                        cb(false,userdata);
                                    }
                                });
                            }
                            
                        });
                    }
                });
            }
        });
    },
    
    changeStatus : (data,cb)=>{
        
        db.users.findById(data.id,(err,udata)=>{
            if(err){
                cb(err,null);
            }
            else{
                if(!udata.active && data.state===true){
                    db.users.findByIdAndUpdate(data.id,{active:true},(err,fdata)=>{
                        if(err){
                            cb(err,null);
                        }
                        else{
                            cb(false,fdata)
                        }
                    })
                }
                else if(udata.active && data.state===false){
                    db.users.findByIdAndUpdate(data.id,{active:false},(err,fdata)=>{
                        if(err){
                            cb(err,null);
                        }
                        else{
                            cb(false,fdata)
                        }
                    })
                }
                else{
                    cb(false,"nochange")
                }
            }
        });
    },

    login : (data,cb)=>{
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
                        const token = auth.genToken(edata._id);
                        cb(false,token);
                    }
                    else{
                        cb("invalid_password",null);
                    }
                });
            }
        });
    }
// end of object
}