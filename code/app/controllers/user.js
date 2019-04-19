var express  = require('express');
var router   = express.Router();
const user = require('../modules/user');

router.get('/:type',function(req,res){
   
    let type = (req.params.type==='active'?true:false);
    let posStart = parseInt(req.query.posStart || 0);
    let count    = parseInt(req.query.count || 5);
   
    user.renderUser(type,posStart,count,(data)=>{
        res.set("Content-type","text/xml").end(data);
    });
    
});

router.post('/',function(req,res){
    let err = [];
    if(req.body.length === 0){
        err.push('No data found');
    }
    else{
        if(req.body.name===undefined || (req.body.name).length >50 || /^[0-9a-zA-Z\s]+$/.test(req.body.name)===false  ){
            err.push('Invalid name')
        }
        if(req.body.phone===undefined || (req.body.phone).length >50 || /^[0-9]+$/.test(req.body.phone)===false  ){
            err.push('Invalid phone number')
        }
        if(req.body.email===undefined || (req.body.email).length >50 || /^\S+@\S+$/.test(req.body.email)===false  ){
            err.push('Invalid email')
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
   
});

router.post('/login',function(req,res){
    let err = [];
    if(req.body.length === 0){
        err.push('No data found');
    }
    else{
        if(req.body.email===undefined || (req.body.email).length >50 || /^\S+@\S+$/.test(req.body.email)===false  ){
            err.push('Invalid email')
        }
        if(req.body.password===undefined || (req.body.password).length >100 || /^[0-9a-zA-Z\s#./!@#$%&*(),]+$/.test(req.body.password)===false  ){
            err.push('Invalid password')
        }
        if(err.length > 0){
            res.json({"message":err,"status":"error"}).end();
        }
        else{
            user.login(
                {
                    email:req.body.email,
                    password:req.body.password
                },
                (err,data)=>{
                    if(err==='invalid_password'){
                        res.json({"message":"Invalid Username or Password","status":"error"}).end();
                    }
                    else if(err==='invalid_email'){
                        res.json({"message":"Invalid Username or Email","status":"error"}).end();
                    }
                    else if(err){
                        res.json({"message":"Error found try later","status":"error"}).end();
                    }
                    else{
                        // res.header({'x-token':data}).json({"message":"Login sucessfully","status":"sucess"}).end()

                        res.cookie('ucr_infosil',data, { expires: new Date(Date.now() + 86400000), httpOnly: true,path:'/',maxAge:86400000 });
                        res.writeHead(302, {
                            'Location': '/'
                        });
                        res.end();
                    }
                }
            )
        }
    }
});

router.put('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});

module.exports = router;