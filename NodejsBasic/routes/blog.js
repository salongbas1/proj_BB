var express = require('express');
var router = express.Router();

var {check,validationResult}= require('express-validator')

var mongodb = require('mongodb');
var blog = require('monk')('localhost:27017/blog');

router.get('/', function(req, res, next) {
  var blogs = blog.get('post')
  blogs.find({},{},function(err,blog){
        res.render('blog',{post: blog});
  }) 
});

router.get('/catablog/add', function(req, res, next) {
        res.render('addblog');
  });

router.post('/catablog/add',[
    check('name','ป้อนชื่ออย่าลืมพิมสิ').not().isEmpty()
], function(req, res, next) {
    var result = validationResult(req)
    var errors = result.errors
    if(!result.isEmpty()){
        res.render('addblog',{errors:errors});
    } else {
        //บันทึกข้อมูล
        var catablog = blog.get('catablog')
        catablog.insert({
            name:req.body.name
        },function(err,success){
            if(err){
                res.send(err)
            } else {
                res.location('/blog')
                res.redirect('/blog')
            }
        })
        
    }
    
});


module.exports = router;
