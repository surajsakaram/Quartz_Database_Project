var express             = require('express');
var router              = express.Router();


router.get('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});
router.get('/page/login/afk',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});



module.exports = router;