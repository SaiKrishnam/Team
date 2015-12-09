/**
 * Created by Saikrishnam on 10/28/2015.
 */
//mongoose connecting to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function callback(){
    console.log(' database connection sucessfull');

});

//CRUD operations on database with mongoose
var Schema = mongoose.Schema ;

//creating new schemas
var schema = new Schema({
    name: String,
    password: String,
    email: String,
    iama: String,
    gender: String,
    latlng:{lat:String,lng:String},
    location : String ,
    imagefile : {type: String , default:'user-logo.png'},
    yeardiagnosed : {type:String, default:'0'},

     });

//adding instance methods, to find the password of a given username

//create a model....create multiple models for different schemas to store information
var userRegistration = mongoose.model('User',schema);


module.exports = userRegistration;