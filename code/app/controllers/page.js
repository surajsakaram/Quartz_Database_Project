var express             = require('express');
var router              = express.Router();


router.get('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});
router.get('/login/afk',function(req,res){
    res.render('pages/login',{ title:"login"});
});



module.exports = router;