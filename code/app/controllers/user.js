var express  = require('express');
var router   = express.Router();
var db   = require('../models');

router.get('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});
router.post('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});
router.put('/',function(req,res){
    res.render('index',{ title:"sdfsdf"});
});

module.exports = router;