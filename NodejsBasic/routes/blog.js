var express = require('express');
var router = express.Router();
var moment = require('moment')

var {check,validationResult}= require('express-validator')

var mongodb = require('mongodb');
var blog = require('monk')('localhost:27017/blog');

router.get('/', function(req, res, next) {
  var blogs = blog.get('post')
  var catablog = blog.get('catablog')
  blogs.find({},{},function(err,blog){
      catablog.find({},{},function(err,catablog){
        res.render('blog',{post: blog , catablog:catablog , moment:moment});
      })     
  }) 
});

router.get('/showblog/:id', function(req, res, next) {
    var blogs = blog.get('post')
    var catablog = blog.get('catablog')
    blogs.find(req.params.id,{},function(err,blog){
        catablog.find({},{},function(err,catablog){
          res.render('showblog',{post: blog , catablog:catablog , moment:moment});
        })     
    }) 
  });

router.get('/post/show/', function(req, res, next) {
    var blogs = blog.get('post')
    var catablog = blog.get('catablog')
    var name = req.query.catablog
    var author = req.query.author
    var title = req.query.title

    if(name){
        blogs.find({catablog:name},{},function(err,blog){
            catablog.find({},{},function(err,catablog){
              res.render('showblogSearch',{post: blog , catablog:catablog , moment:moment , search:name});
            })     
        }) 
    }
    if(author){
        blogs.find({author:author},{},function(err,blog){
            catablog.find({},{},function(err,catablog){
              res.render('showblogSearch',{post: blog , catablog:catablog , moment:moment , search:author});
            })     
        }) 
    }
    if(title){
        blogs.find({title:title},{},function(err,blog){
            catablog.find({},function(err,catablog){
              res.render('showblogSearch',{post: blog , catablog:catablog , moment:moment , search:title});
            })     
        }) 
    }
    
  });
  

router.get('/catablog/add', function(req, res, next) {
        res.render('addblog');
  });


router.get('/post/add', function(req, res, next) {
    var catablog = blog.get('catablog')
    catablog.find({},{},function(err,catablog){
        res.render('addpost',{catablog:catablog});
      })     
});

router.post('/post/add',[
    check('title','ป้อนชื่อบทความอย่าลืมพิมสิ').not().isEmpty(),
    check('desc','ป้อนเนื้อหาอย่าลืมพิมสิ').not().isEmpty(),
    check('image','ใส่รูปอย่าลืมพิมสิ').not().isEmpty(),
    check('author','ป้อนชื่อผู้เขียนอย่าลืมพิมสิ').not().isEmpty()

], function(req, res, next) {
    var result = validationResult(req)
    var errors = result.errors
    var post = blog.get('post')
    if(!result.isEmpty()){
        var catablog = blog.get('catablog')
        catablog.find({},{},function(err,catablog){
            res.render('addpost',{catablog:catablog , errors:errors});
          })  
       
    } else {
        post.insert({
            title:req.body.title,
            catablog:req.body.catablog,
            desc:req.body.desc,
            image:req.body.image,
            author:req.body.author,
            date:new Date()
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
