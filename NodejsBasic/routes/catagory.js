var express = require('express');
var router = express.Router();
var {check,validationResult} = require('express-validator')

var mongodb = require('mongodb');
var stonedb = require('monk')('localhost:27017/Stonebg');



router.get('/add', function(req, res, next) {
  var catagorys = stonedb.get('catagory')

    catagorys.find({},{},function(err,catagory){
          res.render('addcata',{catagorys:catagory})
    })
  });
  
  router.post('/add',[
    check('name','กรุณาป้อนชื่อหมวดหมู่สินค้า').not().isEmpty()
  ], function(req, res, next) {
      var result = validationResult(req);
      var errors = result.errors;
      if(!result.isEmpty()){
         res.render('addcata',{errors:errors})
      } else {
        //insert DB
        var catagory = stonedb.get('catagory')
        catagory.insert({
            name:req.body.name

        },function(err,success){
          if(err){
            res.send(err)
          } else {
            res.location('/community')
            res.redirect('/community')
          }
        })
      }
  });

  
  module.exports = router;