var express             = require('express');
var router              = express.Router();
const dhtx              = require('../modules/dhtx');

router.get('/',function(req,res){
    res.render('pages/index',{ page:"home"});
});
router.get('/login/afk',function(req,res){
    res.render('pages/index',{ page:"login"});
});
router.get('/admin',function(req,res){
    res.render('pages/index',{ page:"admin", json: dhtx.genRibbonJson('admin')});
});



module.exports = router;