var express = require('express');
var router = express.Router();
var userRegistration = require('../database');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var sendgrid  = require('sendgrid')('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');
var kickbox = require('kickbox').client('826ba984e418a0a98527823f24406262058e288225781a3c8ecf93b589844b0e').kickbox();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'SugarMomma' });

 /*   sendgrid.send({
        to:       'snadimpalli@scu.edu',
        from:     'SugarMommas@admin.com',
        subject:  'Welcome to SugarMommas',
        text:     'Thanks for visting us'
    }, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
    });*/

});


router.get('/mapDisplay', function(req, res, next) {

    // render the map
    userRegistration.find({},{country:1,_id:0},function(err,result){
        if(err){
            return console.log('could not read');
        }else{
            console.log('result is only country ');
            console.log(result);

            // the object can only be accessed in the HTML
            res.render('mapDisplay',{countries:result});
        }
    });


});

router.get('/mapDisplayCountries', function(req, res, next) {
    // sending lat,lng data of countries from database to the map
     userRegistration.find({},{latlng:1,_id:0},function(err,result){
        if(err){
            return console.log('could not read');
        }else{
            console.log('getting latlng thats it ');
            console.log(result);
            res.send(result);
        }
    });


});

router.get('/register',function(req,res,next){
    console.log('redirected------');
    res.render('register');
});
// listening for register.ejs form post,do form validation and save to database
router.post('/signup',function(req,res) {


    console.log(req.body.email);
    console.log('-------------------------------------------------req.body.email');
    console.log('lookout for kickbox -----------------');
    // check with kickbox.io if the email exists

    kickbox.verify(req.body.email, function (err, response) {
        // Let's see some results
        console.log('email validated by kickbox says that email validity is:------ '+response.body);
        console.log(response.body.result);
        console.log(response.body.reason);
        if(response.body.result === 'deliverable'){
            // find each person with a email matching email submitted, selecting the email field
            userRegistration.findOne({email:req.body.email}, {email:1}, function (err, response) {
                if (err) {
                    console.log('error in findOne database call');
                    console.log(err);

                }else {

                    if(response){
                        console.log(' email exists in database ');
                        console.log(response);
                        res.send({emailAlreadyExists:'true',emailValid:'true'});
                    }else{
                        console.log(response);
                        // console.log(response.email);
                        console.log('-------------------------------------------------response.email');

                        // Generate a salt , and hash the password with salt---async operation
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                if(err){
                                    console.log('error in hashing')
                                }else{
                                    // assign the hased value to password
                                    req.body.password = hash ;
                                    //create (documents == instances of model) and save to database
                                    console.log(req.body);
                                    var newUser = new userRegistration(req.body);
                                    console.log('req.body accepted');
                                    console.log(req.body);
                                    newUser.save(function(err){
                                        if(err){
                                            console.log('not saved');
                                        }else{
                                            console.log('saved');

                                        }

                                    });

                                }
                            });



                        });
                        res.send({emailAlreadyExists:'false',emailValid:'true'});
                    }

                }
            });
        }else{

            res.send({emailAlreadyExists:'false',emailValid :'false'});
        }

    });




});


router.get('/sample1',function(req,res,next){
      res.render('sample1');

    });

router.get('/forgotPassword',function(req,res,next){
    console.log('cookies are---------------------:'+req.cookies.user);
    res.render('forgotPassword');

});

router.get('/main',function(req,res,next){
    res.render('main');

});


//router.get('/login',function(req,res,next){
//    res.render('login');
//    //console.log(req.session);
//
//});

// setting the cookie here
router.post('/login',function(req,res,next){
    console.log("----------------------");

    console.log(req);


    console.log("----------------------------");


    console.log(req.body);
    // authenticate the creds using bcrypt
    // check if username exists , if yes then compare the passwords
    console.log(req.body.username);

    userRegistration.findOne({email:req.body.username}, function (err, response) {
                   if(err){
                            res.send({match:0,error:1});

                   }else{
                       if(response){
                           console.log(response+"---response is ");
                           // compare password from login page with hashed password from db
                           bcrypt.compare(req.body.password,response.password, function(err, match) {
                               // res == true
                           if(err){
                               console.log('bcrypt error');
                               res.send({match:0,error:1});
                           }else if(match){
                                   console.log('password matches');
                                    router.userName = response.name ;
                                   res.cookie('user',response.email).send({match:1,error:0,usr:response.name});
                           }else{
                               console.log('password dosent match');

                               res.send({match:0,error:0});
                                }
                            });
                       }else{
                           res.send({match:0});
                       }

                   }
                });
        });

// login email check
router.post('/forgotPassword',function(req,res,next){

    console.log(req.body.email);

    userRegistration.findOne({email:req.body.email}, function (err, response) {
        console.log(response);
        if(response){

            //1.generate a random string to send as password
            console.log("random string is ---------"+randomstring.generate(7));
            var tempPassword = randomstring.generate(7);

            //2. save the temporary password in database
            //-- generate a hash using bcrypt for the temporary password
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(tempPassword, salt, function(err, hash) {
                    if (err) {
                        console.log('error in hashing')
                    } else {

                        //update the users password to new one
                        response.password = hash;
                        response.gender = 'female';
                        // save to db
                        response.save(function(err) {
                            if (err) throw err;

                            console.log('User successfully updated!');
                        });

                    }
                })
            });

            //3. send email to user
            console.log('response.email is-------------'+response.email);
               sendgrid.send({
             to:       response.email,
             from:     'SugarMommas@admin.com',
             subject:  'Temporary Password',
             text:     'Your temporary password is '+tempPassword + '. Use this to login.'
             }, function(err, json) {
             if (err) { return console.error(err); }
             console.log(json);
             });
            console.log('email sent-------to-----'+response.email);
            res.send({message : 'Check your email for temporary password',
                      consoleMessage : 'email exists and has been updated  with temp. password'
                    });

        }else{
            // if the response is null, send a message
            res.send({message : 'email does not exist , register to the website',
                consoleMessage : 'email does not exist , register to the website'});
        }

    });


});

// user's can change password after login
router.post('/userPasswordChange',function(req,res,next){

    // every logged in user will have his email in a cookie, which is stored on his browser
    // 1. Get the user's email form cookie && newpassword
    var userEmail = req.cookies.user;
    var newPassword = req.body.password;

    //2. Update the database with the new password

    userRegistration.findOne({email: userEmail},function(err,user){
        if(err){
            console.log('error from database callback ');
            res.send({message:'error from database callback'});
        }else if(user){
            //hash the new password

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newPassword, salt, function(err, hash) {
                    if (err) {
                        console.log('error in hashing')
                    } else {

                        //update the users password to new one
                        user.password = hash;

                        // save to db
                        user.save(function(err) {
                            if (err) throw err;

                            console.log('User successfully changed his password and updated!');
                            res.send({message:'password changed'});
                        });

                    }
                })
            });


        }else{
            res.send({message:'password not changed'});
        }
    });


    //res.send({message:'message from route'});

});

router.get('/form',function(req,res,next){

    res.render('myFormDesign',{name:['sai','vijay','mom','dad']});
});

router.get('/logout',function(req,res,next){
    /*  1.Destroy the cookie user
     2.Redirect to login page
     */
    console.log('entered logout route ');
    if(req.cookies.user){
        console.log(req.cookies);
        console.log('entered logout-------------------->');
        res.clearCookie('user').redirect('../register');
        console.log(req.cookies.name+"--------------cookie name value");

    } else{
        console.log('erroneous try')
        res.send('sam');
    }



});

router.get('/fn',function(req,res,next){
    // send imageFile back
    console.log('entered dpfilename');
    userRegistration.findOne({email:req.cookies.user}, function (err, user) {
        if (err) {
            console.log('error in findOne database call');
            console.log(err);

        } else {
            console.log('sending the filename for dp');
            console.log(user.imagefile);
            res.setHeader('Cache-Control', 'no-cache, no-store'); // Added no-store
            res.send({message : user.imagefile});
        }

    });



});


router.get('/details',function(req,res,next){
    // send the details of every user in db ideally
    console.log(req.cookies.user);
    userRegistration.find({},function(err,user){

        if(err){
            console.log('error in details database call');
        }else{

            console.log('sending userInfo'+user);
            res.setHeader('Cache-Control', 'no-cache, no-store'); // Added no-store

            res.render('details',{userInfo : user});

        }

    });

});


router.get('/getAllUsersInfo',function(req,res,next){

    userRegistration.find({},function(err,user){

        if(err){
            console.log('error in details database call');
        }else{
            res.setHeader('Cache-Control', 'no-cache, no-store'); // Added no-store

            console.log('sending userInfo'+user);
            res.send({allUsersInfo : user});

        }

    });


});



module.exports = router;
