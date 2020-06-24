var express = require('express');
var router = express.Router();
var {check,validationResult} = require('express-validator')

var mongodb = require('mongodb');
var stonedb = require('monk')('localhost:27017/Stonebg');



//upload
var multer = require('multer');
var stor = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images');
  },
  filename:function(req,file,cb){
      cb(null,Date.now()+".jpg");
  }
})


//ที่อยู่ที่เก็บไฟล์
var upload = multer({storage:stor})

function enSureAuthenticated(req,res,next){
      if(req.isAuthenticated()){
              return next();
      } else {
        res.redirect('/users/login');
      }
}

router.get('/add', function(req, res, next) {
    var catagorys = stonedb.get('catagory')
    catagorys.find({},{},function(err,catagory){
          res.render('addproduct',{catagorys:catagory})
    })
  });

  //ดูรายละเอียดสินค้า
  router.get('/show/:id',enSureAuthenticated, function(req, res, next) {
      var catagorys = stonedb.get('catagory')
      var products = stonedb.get('products')

      products.find(req.params.id,{},function(err,product){
        catagorys.find({},{},function(err,catagory){
              res.render('show',{catagorys:catagory,products:product})
        })
      })
  });

  router.get('/show/',enSureAuthenticated, function(req, res, next) {
      var catagorys = stonedb.get('catagory')
      var products = stonedb.get('products')
      var catagoryname = req.query.catagory
      if(catagoryname){
            //สินค้าที่อยู่ในหมวดหมู่จะออกไปแสดง
            products.find({catagory:catagoryname},{},function(err,product){
                  console.log(product)
                  catagorys.find({},{},function(err,catagory){
                        res.render('searchproduct',{catagorys:catagory,products:product})
                  })
            })
      }
  });


  router.post('/cart/', function(req, res, next) {
            //ส่งค่าไอดีจากสินค้า
            var products = stonedb.get('products');
            var product_id = req.body.product_id;
            //สร้างตะกร้าเปล่า
            req.session.cart = req.session.cart || {};
            var cart= req.session.cart
            products.find({_id:product_id},{},function(err,product){
                 //เก็บข้อมูลลง secsion
                 //ในตะกร้าจะเก็บ ไอดี ชื่อ ราคา และก็ปริมาณ
                  //กรณีที่ซื้อมากกว่า 1 ชิ้น
                  if(cart[product_id]){
                        cart[product_id].qty++;
                  } else {
                        //ซื้อครั้งแรก
                        product.forEach(function(item){
                              cart[product_id] = {
                                    item:item._id,
                                    title:item.name,
                                    price:item.price,
                                    qty:1
                              }
                        })
                        //เพิ่มตามจำนวนคลิ๊ก
                  }
                  res.redirect('/products/cart')
            })     

  });

  
  


  router.get('/cart',enSureAuthenticated, function(req, res, next) {
      //ตะกร้า
      var cart= req.session.cart
      var disPlayCart = {
            item:[],total:0
      }
      var total=0;
      for(item in cart){
            //displat put data เก็บข้อมูลสินค้า
           disPlayCart.item.push(cart[item])
           //คำนวนราคาสินค้า
           total+=(cart[item].qty * cart[item].price)
      }
      disPlayCart.total = total
      res.render('cart',{cart:disPlayCart})
});

router.get('/cart/clear',enSureAuthenticated, function(req, res, next) {
      //ตะกร้า
      delete req.session.cart
      var disPlayCart = {
            item:[],total:0
      }
      
      res.render('cart',{cart:disPlayCart})
});



  router.post('/add',upload.single("image"),[
      check('name','กรุณาป้อนชื่อหมวดหมู่สินค้า').not().isEmpty(),
      check('desc','กรุณาป้อนชื่อรายละเอียดสินค้า').not().isEmpty(),
      check('price','กรุณาป้อนราคาสินค้า').not().isEmpty(),
      
      
    ], function(req, res) {

      console.log(req.body.name) 
      console.log(req.body.price)  
      console.log(req.body.desc)  
      console.log(req.body.image)  
      console.log(req.file+req.files)

      if(req.file){
            //เช็คเก็ยพาทที่อยู่ของรูป
            var testimage = req.file.filename
          } else {
            var testimage = "No image"
          }

      console.log(req.file) 
        var result = validationResult(req);
        var errors = result.errors;
        var products =stonedb.get('products')
        var catagorys = stonedb.get('catagory')
        
            
        if(req.file){
            //เช็คเก็ยพาทที่อยู่ของรูป

            var testimage = req.file.filename
            console.log('heeee'+testimage)
          } else {
            var testimage = "No image"
          }

        if(!result.isEmpty()){
            
            catagorys.find({},{},function(err,catagory){
                  res.render('addproduct',{catagorys:catagory,errors:errors})
            })
        } else {
         //เพิ่มข้อมูลลง ดาต้า
         
         console.log(testimage)
            products.insert({
                  name:req.body.name,
                  desc:req.body.desc,
                  //แปรงให้เป้นตัวเลขคำนวนได้
                  price:parseFloat(req.body.price),
                  image:testimage,
                  catagory:req.body.catagory
                  
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