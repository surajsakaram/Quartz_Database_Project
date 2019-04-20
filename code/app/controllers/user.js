var express  = require('express');
var router   = express.Router();
const user = require('../modules/user');

router.get('/:type',function(req,res){
    if(res.locals.userData===null){
        res.set("Content-type","text/xml")
        .end('<?xml version="1.0" encoding="iso-8859-1" ?><rows><userdata name="session">expire</userdata></rows>');
    }
    else{
        let type = (req.params.type==='active'?true:false);
        let posStart = parseInt(req.query.posStart || 0);
        let count    = parseInt(req.query.count || 5);
    
        user.renderUser(type,posStart,count,(data)=>{
            res.set("Content-type","text/xml").end(data);
        });
    }
    
    
});

router.post('/',function(req,res){

    if(res.locals.userData===null || res.locals.userData.groupId.name!=='admin'){
        res.end('<div><script type="text/javascript"> obj.session_expire("session expire");</script></div>');
    }
    else{
        let err = [];
        if(req.body.length === 0){
            err.push('No data found');
        }
        else{
            if(req.body.name===undefined || (req.body.name).length >50 || /^[0-9a-zA-Z\s]+$/.test(req.body.name)===false  ){
                err.push('Invalid name');
            }
            if(req.body.phone===undefined || (req.body.phone).length >50 || /^[0-9]+$/.test(req.body.phone)===false  ){
                err.push('Invalid phone number');
            }
            if(req.body.email===undefined || (req.body.email).length >50 || /^\S+@\S+$/.test(req.body.email)===false  ){
                err.push('Invalid email');
            }
            if(req.body.password===undefined || (req.body.password).length >100 || /^[0-9a-zA-Z\s#./!@#$%&*(),]+$/.test(req.body.password)===false  ){
                err.push('Invalid password')
            }
            if(err.length > 0){
                res.json({"message":err,"status":"error"}).end();
            }
            else{
                user.createUser(
                    {
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password,
                        phone:req.body.phone
                    },
                    (err,data)=>{
                        if(err){
                            if(err==='email'){
                                res.json({"message":"Email already exist","status":"error"}).end();
                            }else{
                                res.json({"message":"Error found","status":"error"}).end();
                            }
                        }else{
                            res.json({"message":"User created sucessfully","status":"sucess"}).end();
                        }
                    }
                );
            }
        }
    }
    
   
});

router.put('/:id/state/:type',function(req,res){
  
    if(res.locals.userData===null || res.locals.userData.groupId.name!=='admin'){
        res.end('<div><script type="text/javascript"> obj.session_expire("session expire");</script></div>');
    }
    else{
        let type =  req.params.type==="activate"?true:false;
        user.changeStatus(req.params.id,type,(err,data)=>{
            if(err){
                res.json({"status":"error"})
            }
            else{
                console.log(data);
                res.json({"status":"sucess"})
            }
        });
    }
});

module.exports = router;