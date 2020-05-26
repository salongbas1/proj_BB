//model เก็บค่า users


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/LoginDB';
var bcrypt = require('bcryptjs');

//เชื่อมต่อ ดีบี
mongoose.connect(mongoDB,{
    useNewUrlParser:true
})

var db = mongoose.connection;

//เช็คว่าการเชื่อมต่อ error ไหม
db.on('error',console.error.bind(console,'mongodb Error'))


//สร้างสกีม่า 
var userSchema = mongoose.Schema({
    name:{ type:String },
    email:{ type:String },
    password:{ type:String },
    location:{ type:String },
    callnumber:{ type:String },
    image:{ type:String}

})


//และไปอิมพอตที่ เร้า users.js
var User = module.exports = mongoose.model('User',userSchema);

//เตรียมตัวดำเนินการข้อมูลใน newUser จากตัว users.js
module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
        //การเข้ารหัสและดึง key password และจะได้ผลลัพเก็บไว้ที่ hash
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback); //ทำการเซฟ
        });
    });
}

module.exports.getUserById = function(id,callback){
    //ทำการค้นหา ไอดี
    User.findById(id,callback)
}
module.exports.getUserByName = function(name,callback){
    //ค้นหาชื่อ
    var query = {
        name:name
    }
    User.findOne(query,callback);
}

//เปรียบเทียบรหัสผ่าน
module.exports.comparePassword = function(password,hash,callback){
  bcrypt.compare(password,hash,function(err,isMAtch){
      callback(null,isMAtch);
  });
    
}