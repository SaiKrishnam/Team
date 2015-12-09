var express = require('express');
var router = express.Router();
var userRegistration = require('../database');
// Load the bcrypt module
var bcrypt = require('bcrypt');
var sendgrid  = require('sendgrid')('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');
var multer = require('multer');
var fs = require('fs');

router.get('/',function(req,res,next){

  res.render('users');

});

//function nocache(req, res, next) {
//  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//  res.header('Expires', '-1');
//  res.header('Pragma', 'no-cache');
//  console.log('setting no cache ');
//  next();
//}


// personal pages for usergetDpFilenames
router.get('/:username',function(req,res,next){

  if(req.cookies.user){
    console.log("/:username--------------"+req.params.username);

    res.setHeader('Cache-Control', 'no-cache, no-store'); // Added no-store


    ////specify if the content should be cached or no
    //res.setHeader('Cache-Control', 'no-cache');


    // send the url for image
    res.render('personalPage',{name:'hello'});


  }else{
    console.log('no cookie so redirect to login page------->');
    res.redirect('../register');
  }



});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/profilePic'); // Absolute path. Folder must exist, will not be created for you.
  },
  filename: function (req, file, cb) {
    cb(null, req.cookies.user + '-' +Date.now());
  }
})

var upload = multer({ storage: storage });

// upload the image file and store the url in database with the cookie containing email
router.post('/upload',upload.single('file'),function(req,res){
  console.log('entered upload route');
  //console.log(req.body+"---request"); // form data
  console.log(req.file.filename +"---file is");// file uploaded will be here
  console.log(req.file.originalname +"---file is")
  console.log(req.file.path +"---file is")

  /*
  1. The image is uploaded to the dest. with its name.
  2. Every user has only one image in the db at any point , since new image's replace the old one.
  3. Save the image file name to database and send it whenever a user logins to his account
   */

// check if the user is loogged in |
  userRegistration.findOne({email:req.cookies.user}, function (err, user) {
    if (err) {
      console.log('error in findOne database call');
      console.log(err);

    }else{

      ////delete the previous image file of this user
      //fs.unlink('./public/images/profilePic/file-papu@tinku', function (err) {
      //  if (err) throw err;
      //  console.log('successfully deleted /tmp/hello');
      //});


      //new name is saved to db
      user.imagefile = req.file.filename;

      user.save(function(err) {
        if (err) throw err;
        console.log('User successfully changed imageFile and updated!');

      });

      //console.log('user from db on change and save is:----'+user);

      console.log(user.imagefile);
      res.send(user.imagefile);
    }


  });





});



module.exports = router;
