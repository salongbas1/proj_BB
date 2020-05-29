var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var connectflash = require('connect-flash')
//เชื่อมต่อ DB
var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/ProjectDB');
var stonedb = require('monk')('localhost:27017/Stonebg');

//เชื่อมต่อการ อัพโหลด 
var multer = require('multer');
//ที่อยู่ที่เก็บไฟล์
var upload = multer({dest:'./public/images'})


// middlewere
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy


var session = require('express-session')





var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var profileRouter = require('./routes/profile');
var indexRouter = require('./routes/index');
var communityRouter = require('./routes/community');
var adminRouter = require('./routes/admin');
var catagoryRouter = require('./routes/catagory');
var productRouter = require('./routes/products');
var socialRouter = require('./routes/social');





//ประกาศใช้ secsion
var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(passport.initialize())
app.use(passport.session())

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(require('connect-flash')());


app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



//ประกาศให้ทุกที่รู้จัก user
app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
})

//ที่ไว้ใส่ เร้าหรือ
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/profile',profileRouter);
app.use('/community',communityRouter);
app.use('/admin',adminRouter);
app.use('/catagory',catagoryRouter)
app.use('/products',productRouter)
app.use('/social',socialRouter)

//จำกัดจำนวนข้อความ
app.locals.descText= function(text,length){
  return text.substring(0,length);
}

//ใส่ลูกน้ำ
app.locals.formatMoney=function(num){
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}





module.exports = app;
