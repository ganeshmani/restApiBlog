var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended : true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended : true}));

var dbpath = "mongodb://localhost/myblog";

db = mongoose.connect(dbpath);

mongoose.connection.once('open',function(){
    console.log("database connected successfully");
});

var Blog = require('./blogModel.js');

var blogModel = mongoose.model('Blog');


//Application Level middlewares
app.use(function(req,res,next){
	console.log("Time n Date Log ",new Date());
	console.log("Request url Log ",req.originalUrl);
	console.log("Request Method Log ",req.method);
	console.log("Request Ip address Log ",req.ip);
	next();
});


// Routing for Blogs
app.get('/',function(request,response){
response.send("Successful");
});

//display all the blogs
app.get('/blogs',function(request,response){
      blogModel.find(function(err,res){
          if(err){
            response.send(err);
          }
          else {
             response.send(res);
          }
     });
});

//functionality to view particular blog
app.get('/blogs/:id',function(request,response){
    blogModel.findOne({'_id': request.params.id},function(err,res){
        if(err)
        {
              response.send(err);
        }
        else{
          response.send(res);
        }

    });

});

//functionality to create a blog
app.post('/blogs/create',function(request,response){

    var newBlog = new blogModel();
          newBlog.title = request.body.title;

          newBlog.subTitle = request.body.subTitle;

          newBlog.author = { authorName : request.body.authorName, city : request.body.city };

          var allTags = (request.body.tags != undefined && request.body.tags != null ) ? request.body.tags : '';

          newBlog.tags = allTags;

          var date = Date.now();

          newBlog.CreatedDate = date;

           console.log(newBlog);
          newBlog.save(function(err,res){
             if(err)
             {
               response.send(err);
             }
             else {
                response.send(res);
             }

          });

});

//functionality to edit a blog
app.put('/blogs/:id/edit',function(request,response){
    var updateBlog = request.body;
    blogModel.findOneAndUpdate({'_id':request.params.id},updateBlog,function(err,res){
       if(err)
       {
         response.send(err);
       }
       else {
          response.send(res);
       }

    });
});


//functionality to delete a blog
app.post('/blogs/:id/delete',function(request,response){
    blogModel.remove({'_id': request.params.id},function(err,res){
       if(err)
       {
         response.send(err);
       }
       else {
          response.send(res);
       }
    });
});

//Error handling Middleware
app.get('*',function(request,response,next){
    response.status = 404;
    next("path not found");
});

app.use(function(err,req,res,next){
  if(res.status = 404)
  {
   console.error(err);
   res.send('<h1 style="text-align : center; color: #000000; ">Error : 404 . Page not found.Please Try Again Later....</h1>');
 }
 else {
   {
     res.send(err);
   }
 }
});

//declaring port to listen
app.listen(3000,function(){
console.log("the app is listening to port 3000");

})
