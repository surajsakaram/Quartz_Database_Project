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
                            else if(edata != null && edata._id !== undefined){
                                cb("email",null);
                            }
                            else{
                                db.users.create({
                                    name:data.name,
                                    email:data.email,
                                    password:password,
                                    createOn:Math.floor(Date.now()/1000),
                                    lastLogin:0,
                                    active:true,
                                    phone:data.phone,
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
                        db.users.updateOne({_id:edata._id},{lastLogin:Math.floor(Date.now()/1000)},(err,udata)=>{
                            if(err){
                                cb(err,null);
                            }
                            else{
                                const token = auth.genToken(edata._id);
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
    renderUser:(type,posStart,rowCount,cb)=>{
       
        let xmlData = "<?xml version='1.0' encoding='utf-8' ?>";  
        db.group.findOne({name:"user"},(err,gdata)=>{  
            if(err){
                xmlData += `<rows total_count="0" pos="0"></rows>`;
                cb(xmlData);
            }
            else{
                db.users.count({active:type,groupId:gdata._id},(err,count)=>{
                    if(err || count == 0){
                        xmlData += `<rows total_count="0" pos="0"></rows>`;
                        cb(xmlData);
                    }
                    else { 
                        if(err){
                            xmlData += `<rows total_count="0" pos="0"></rows>`;
                            cb(xmlData);
                        }
                        else{
                           
                            db.users.find({active:type,groupId:gdata._id}).skip(posStart).limit(rowCount).exec((err,udata)=>{ 
                                if(err || udata.length == 0){
                                    xmlData += `<rows total_count="10" pos="10"></rows>`;
                                    cb(xmlData);
                                }
                                else{
                                    xmlData += `<rows total_count="${count}" pos="${posStart}">`;
                                    let rowData = "";
                                    for(let i =0; i < udata.length; i++){
                                        rowData +=  `<row id="${udata[i]._id}">`;
                                        rowData += `<cell>${udata[i].name}</cell>`;
                                        rowData += `<cell>${udata[i].phone}</cell>`;
                                        rowData += `<cell>${udata[i].email}</cell>`;
                                        let lastlogin = udata[i].lastLogin==0?" ":udata[i].lastLogin;
                                        rowData += `<cell>${udata[i].createOn}</cell>`;
                                        rowData += `<cell>${lastlogin}</cell>`;
                                        
                                        rowData += "</row>"
                                    }
                                    xmlData += rowData + '</rows>';
                                    cb(xmlData)
                                    
                                }
                            });
                        }
                    }
    
                });
            }   
            
        }) ;   
    }
// end of object
}