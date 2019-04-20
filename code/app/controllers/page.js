var express             = require('express');
var router              = express.Router();
const dhtx              = require('../modules/dhtx');
const auth = require('../modules/auth');
router.get('/',function(req,res){
    res.render('pages/index',{ page:"home"});
});
router.get('/login/',function(req,res){
    res.render('pages/index',{ page:"login"});
});
router.post('/login',function(req,res){
    if(req.body.length === 0){
        res.redirect('/page/login');       
    }
    else{
        if(req.body.email===undefined || (req.body.email).length >50 || /^\S+@\S+$/.test(req.body.email)===false  ){           
            res.redirect('/page/login');
        }
        if(req.body.password===undefined || (req.body.password).length >100 || /^[0-9a-zA-Z\s#./!@#$%&*(),]+$/.test(req.body.password)===false  ){
            res.redirect('/page/login');
        }
        else{
            auth.login(
                {
                    email:req.body.email,
                    password:req.body.password
                },
                (err,data)=>{
                    if(err){
                        res.redirect('/page/login');
                    }
                    else{
                        res.cookie('ucr_infosil',data, { expires: new Date(Date.now() + 86400000), httpOnly: true,path:'/',maxAge:86400000 }).redirect('/page/admin');
                    }
                }
            )
        }
    }
});
router.get('/admin',function(req,res){
    if(res.locals.userData===null){
        res.render('pages/notFound');
    }else{
        res.render('pages/index',{ page:"admin", json: dhtx.genRibbonJson( res.locals.userData.groupId.name)});
    }
});



module.exports = router;