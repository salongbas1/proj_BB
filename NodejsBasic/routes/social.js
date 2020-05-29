var express = require('express');
var router = express.Router();


var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/social');

router.get('/', function(req, res, next) {

    var post = db.get('post')
    
    post.find({},{},function(err,posts){
        res.render('social',{post: posts});
    })
  
});

router.get('/post', function(req, res, next) {
    res.render('addPJ')
  });


var multer = require('multer'); 
var storage = multer.diskStorage({
    destination:function(req,file,cb){
      //ระบุพาท
      cb(null,'./public/images')
    },
    filename:function(req,file,cb){
      cb(null,Date.now()+".jpg")
    }
})



//ที่อยู่ที่เก็บไฟล์
var upload = multer({storage:storage})


router.post('/post',upload.single("image"), function(req, res, next) {
    var   post = db.get('post');
if(req.file){
  //เช็คเก็ยพาทที่อยู่ของรูป
  var testimage = req.file.filename
} else {
  var testimage = "No image"
}
post.insert ({
   name:req.body.name,
   desc:req.body.desc,
   //ใช้เชื่อมจากที่เช็ครูป
   user_image:req.body.user_image,
   image:testimage
},function(err,success){
  if(err){
    res.send(err)
  } else {
    console.log(req.body.user_image)
    res.location('/social')
    res.redirect('/social')
  }
})


 });



module.exports = router;
