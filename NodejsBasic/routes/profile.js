var express = require('express');
var router = express.Router();


var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/ProjectDB');
var ddb = require('monk')('localhost:27017/LoginDB');


//upload
var multer = require('multer');
var stone = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images');
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+".jpg");
  }
})

//ที่อยู่ที่เก็บไฟล์
var upload = multer({storage:stone})

//โฟรเดอร์
router.get('/',enSureAuthenticated, function(req, res, next) {
  var prousers = ddb.get('users');
  prousers.find({},{},function(err,prouser){
    console.log(prouser);
    res.render('profile',{prousers:prouser})
  }) 
});

function enSureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
          return next();
  } else {
    res.redirect('/users/login');
  }
}


router.get('/edit/:id',enSureAuthenticated, function(req, res, next) {
  var prousers = db.get('users');
  prousers.find(req.params,{},function(err,prouser){
    console.log(prouser);
    res.render('proedit',{prousers:prouser})
  }) 
});

router.get('/edit',function(req,res,next){
  res.render('proedit')
})

router.post('/edit',upload.single("image"),function(req,res,next){
  var Users = ddb.get('users');
  //มีการแก้ไขอัพโหลดภาพ
  if(req.file){
      var usersimage = req.file.filename;
      Users.update({
          _id:req.body.id
      },{
        $set:{
          name:req.body.name,
          email:req.body.email,
          password:req.body.password,
          location:req.body.location,
          callnumber:req.body.callnumber,
          image:usersimage
        }
      },function(err,success){
        if(err){
          res.send(err)
        } else {
          res.location('/profile')
          res.redirect('/profile')
        }
      })
  } else {
    
    Users.update({
        _id:req.body.id
    },{
      $set:{
        name:req.body.name,
        email:req.body.email,
        location:req.body.location,
        callnumber:req.body.callnumber,
        password:req.body.password,
        
      }
    },function(err,success){
      if(err){
        res.send(err)
      } else {
        res.location('/profile')
        res.redirect('/profile')
      }
    })
  }

  

  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.file);

})


module.exports = router;