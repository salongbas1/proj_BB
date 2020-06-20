var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/ProjectDB');
var stonedb = require('monk')('localhost:27017/Stonebg');
var blog = require('monk')('localhost:27017/blog');

//การอัพโหลดใช้ตัวนี้
//เชื่อมต่อการ อัพโหลด 
var multer = require('multer');


//สร้างออปชั่นการโหลบด
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



/* GET home page. */
router.get('/Projects', function(req, res, next) {
      var   Projects = db.get('Projects');
      var catagorys = stonedb.get('catagory')
      var products = stonedb.get('products')
      var catablog = blog.get('catablog')
      var post = blog.get('post')

      Projects.find({},{},function(err,project){
        products.find({},{},function(err,product){
          catagorys.find({},{},function(err,catagory){
            catablog.find({},{},function(err,catablog){
              post.find({},{},function(err,post){
              console.log(project)
              res.render('adminproject',{Projects:project,catagorys:catagory,products:product, catablog:catablog ,post:post})
              })
            })
          })
        })
      })
});



router.get('/Projects/add', function(req, res, next) {
  res.render('addPJ')
});


router.get('/Projects/edit/:id', function(req, res, next) {
  var   Projects = db.get('Projects');
  Projects.find(req.params.id,{},function(err,project){
   res.render('editPJ',{Projects:project})
  
})

});

router.get('/Projects/products/edit/:id', function(req, res, next) {
  var products = stonedb.get('products')
  products.find(req.params.id,{},function(err,product){
   res.render('editPD',{products:product})
  
})
});



//การลบข้อมูล
router.get('/Projects/delete/:id', function(req, res, next) {
 //เข้าถึงโปรเขจ็ค
  var   Projects = db.get('Projects');
  Projects.remove({_id:req.params.id});
  res.redirect('/admin/Projects');
  
})

//การลบข้อมูล
router.get('/Projects/products/delete/:id', function(req, res, next) {
  //เข้าถึงโปรเขจ็ค
    var products = stonedb.get('products')
    products.remove({_id:req.params.id});
    res.redirect('/admin/Projects');
   
 })

 //การลบข้อมูล
router.get('/Projects/catagory/delete/:id', function(req, res, next) {
  //เข้าถึงโปรเขจ็ค
    var catagorys = stonedb.get('catagory')
    catagorys.remove({_id:req.params.id});
    res.redirect('/admin/Projects');
   
 })

 router.get('/Projects/blog/delete/:id', function(req, res, next) {
  //เข้าถึงโปรเขจ็ค
    var catablog = blog.get('catablog')
    catablog.remove({_id:req.params.id});
    res.redirect('/admin/Projects');
   
 })

 router.get('/Projects/post/delete/:id', function(req, res, next) {
  //เข้าถึงโปรเขจ็ค
    var post = blog.get('post')
    post.remove({_id:req.params.id});
    res.redirect('/admin/Projects');
   
 })




router.post('/Projects/add',upload.single("image"), function(req, res, next) {
    var   Projects = db.get('Projects');
if(req.file){
  //เช็คเก็ยพาทที่อยู่ของรูป
  var testimage = req.file.filename
} else {
  var testimage = "No image"
}
Projects.insert ({
   name:req.body.name,
   desc:req.body.desc,
   date:req.body.date,
   //ใช้เชื่อมจากที่เช็ครูป
   image:testimage
},function(err,success){
  if(err){
    res.send(err)
  } else {
    res.location('/admin/Projects')
    res.redirect('/admin/Projects')
  }
})

 });



//แก้ไข
 router.post('/Projects/edit',upload.single("image"), function(req, res, next) {
  var   Projects = db.get('Projects');
  //มีการแก้ไขและอัพโหลดภาพ
if(req.file){
//เช็คเก็ยพาทที่อยู่ของรูป
var testimage = req.file.filename;
Projects.update({
  _id:req.body.id
},{
  $set:{
    name:req.body.name,
    desc:req.body.desc,
    date:req.body.date,
    image:testimage
  }
},function(err,success){
  if(err){
    res.send(err)
  } else {
    res.location('/admin/Projects')
    res.redirect('/admin/Projects')
  }
})
} else {
    //แก้ไขบกเว้นภาพ
    Projects.update({
      _id:req.body.id
    },{
      $set:{
        name:req.body.name,
        desc:req.body.desc,
        date:req.body.date
      }
    },function(err,success){
      if(err){
        res.send(err)
      } else {
        res.location('/admin/Projects')
        res.redirect('/admin/Projects')
      }
    })
}

});


//แก้ไข
router.post('/Projects/products/edit',upload.single("image"), function(req, res, next) {
  var products = stonedb.get('products')
  //มีการแก้ไขและอัพโหลดภาพ
  var testimage = req.file  
  console.log('hhhhhhhhhhhh'+testimage)

if(req.file){
  //เช็คเก็ยพาทที่อยู่ของรูป
   testimage = req.file.filename;

  console.log(testimage)
  products.update({
    _id:req.body.id
  },{
    $set:{
      name:req.body.name,
      price:req.body.price,
      desc:req.body.desc,
      image:testimage
    }
  },function(err,success){
    if(err){
      res.send(err)
    } else {
      res.location('/admin/Projects')
      res.redirect('/admin/Projects')
    }
  })
} else {
    //แก้ไขบกเว้นภาพ
    products.update({
      _id:req.body.id
    },{
      $set:{
        name:req.body.name,
        price:req.body.price,
        desc:req.body.desc
      }
    },function(err,success){
      if(err){
        res.send(err)
      } else {
        res.location('/admin/Projects')
        res.redirect('/admin/Projects')
      }
    })
}

});





module.exports = router;