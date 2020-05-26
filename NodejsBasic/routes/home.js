var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/ProjectDB');
/* GET home page. */


router.get('/', function(req, res, next) {
  var   Projects = db.get('Projects');
    Projects.find({},{},function(err,project){
    console.log(project)
    res.render('home',{Projects:project})
  })

  });

  router.get('/details/:id', function(req, res, next) {
    var   Projects = db.get('Projects');
      Projects.find(req.params.id,{},function(err,project){
      console.log(project)
      res.render('det',{Projects:project})
    })
    });
    
  
  router.get('/delete', function(req, res, next) {
    res.send('delete profile');
  });

  function enSureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
            return next();
    } else {
      res.redirect('/users/login');
    }
}
  
  module.exports = router;
  