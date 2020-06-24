var express = require('express');
var router = express.Router();
const{check,validationResult} = require('express-validator')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy




//อิมพอตโมดูล mongodb
var User=require('../model/user')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Kuy users');
});

router.get('/register',function(req,res){
  res.render('register')
})


router.get('/login',function(req,res){
  res.render('login')
})

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/users/login')
})


//
router.post('/login', passport.authenticate('local',{
    failureRedirect:'/users/login',
    failureFlash:false

}),function(req,res){

   req.flash("Success", "ลงชื่อเข้าใช้เรียบร้อย");
   //ถ้าใส่รหัสผ่านถูกต้องไปหน้าแรก
    res.redirect('/profile')  
})

//ดึงข้อมูลที่เหลือ
passport.serializeUser(function(user,done){
  //ถ้าหากลงชื่อเข้าใช้แล้ว เฟล ให้รีเทรินค่า null ถ้าสำเร็จจะได้ user.id
      done(null,user.id);
})

passport.deserializeUser(function(id,done){
      User.getUserById(id,function(err,user){
          done(err,user);
      })
})

passport.use(new LocalStrategy(function(username,password,done){
      User.getUserByName(username,function(err,user){
          if(err) throw error
          //เปรียบเทียบชื่อแล้วหาไม่เจอ
          if(!user){
            //ไม่พบผู้ใช้
            return done(null,false)
          } else {
            
            User.comparePassword(password,user.password,function(err,isMAtch){
              if(err) throw error
              console.log(isMAtch)
              //รหัสผ่านตรงกัน
              if(isMAtch){
                
                return done(null,user)
              }
              else {//ไม่พบผู้ใช้
                 return done(null,false)
              }
           })  
           
          }
            
      });  
       
}));



//upload
var multer = require('multer');
var gg = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images');
  },
  filename:function(req,file,cb){
    cb(null,file.originalname);
  }
})
//ที่อยู่ที่เก็บไฟล์
var upload = multer({storage:gg})


//รับค่าจาก register บันทึกข้อมูล
router.post('/register',upload.single("image"),[
  check('name','กรุณาป้อนชื่อผู้ใช้งาน*').not().isEmpty(),
  check('email','กรุณาป้อนอีเมล*').isEmail(),
  check('password','กรุณาป้อนรหัสผ่าน*').not().isEmpty(),
  check('location','กรุณาป้อนที่อยู่ผู้ใช้งาน*').not().isEmpty(),
  check('callnumber','กรุณาป้อนเบอร์โทรศัพท์*').not().isEmpty(),

  

],function(req,res){
  
    console.log(req.body.name) 
    console.log(req.body.password)  
    console.log(req.body.email)  
    console.log(req.file)   

    if(req.file){
      //เช็คเก็ยพาทที่อยู่ของรูป
      var testimage = req.file.filename
    } else {
      var testimage = "No image"
    }
    


    const result = validationResult(req);
    var errors=result.errors;
    //Check
    if(!result.isEmpty()){
      //return error to view
      res.render('register',{errors : errors})
    } else {
        //insert Data
        var name = req.body.name;
        var password = req.body.password;
        var email = req.body.email;
        var location = req.body.location;
        var callnumber = req.body.callnumber;
        var image = testimage

        var newUser = new User({
          name:name,
          password:password,
          email:email,
          location:location,
          callnumber:callnumber,
          image:image
        })
        User.createUser(newUser,function(err,user){
          //เช็ค error
          if(err) throw err //error ให้โยนค่าทิ้ง
        })
        //ถ้าบันทึกเสร็จแล้วให้ไปหน้าแรก
        res.location('/profile');
        res.redirect('/profile');
    }
  
});


module.exports = router;
