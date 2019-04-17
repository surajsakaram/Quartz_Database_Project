const db  = require('../models');
const auth  = require('./modules/auth')
module.exports = {

    createUser : (data,cb)=>{
        auth.genPassword(data.email,(err,password)=>{
            if(err){
                cb(err,null);
            }else{
                db.group.findOne({name:"user"},(err,gdata)=>{
                    if(err){
                        cb(err,null);
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
    }
// end of object
}