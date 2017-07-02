
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogSchema = new Schema({
     title : {type : String,default : '' , required : true },
     subTitle : { type : String,default : '' },
     author : {},
     tags : [],
     CreatedDate : { type : Date }
});

var blog = mongoose.model('Blog',blogSchema);
