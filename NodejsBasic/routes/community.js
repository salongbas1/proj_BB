var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var stonedb = require('monk')('localhost:27017/Stonebg');


//ข้อมูลของสินค้าอยู่นี่
router.get('/', function(req, res, next) {
    var catagorys = stonedb.get('catagory')
    var products = stonedb.get('products')
    products.find({},{},function(err,product){
      catagorys.find({},{},function(err,catagory){
            res.render('community',{catagorys:catagory,products:product})
      })
    })
});
  

  
  module.exports = router;