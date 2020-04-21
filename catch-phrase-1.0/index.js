var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var paths = require('path');
var bodyParser 	= require('body-parser');
//require the http module
//const http = require("http").Server(app);
//var ioServer 	= require('./socket')(app);
var server = require('http').Server(app);
var io = require('./socket').init(server);

// require the socket.io module
//const io = require("socket.io");
//integrating socketio
//socket = io(http);
var User = require('./models/user');
var Arena = require('./models/arena');
var CatchPhrase = require('./models/catchphrase');

app.use(express.static(paths.join(__dirname, 'public')));

//const post = require('./models/post.model')
const m = require('./helpers/middlewares')



// View engine setup
//app.set('views', paths.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTERS

app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.render('login');
});

/* A post by id */
router.get('/api/:id', m.mustBeInteger, async (req, res) => {
  const id = req.params.id

  await post.getPost(id)
  .then(post => res.json(post))
  .catch(err => {
      if (err.status) {
          res.status(err.status).json({ message: err.message })
      } else {
          res.status(500).json({ message: err.message })
      }
  })
})

router.post("/arenas", function(req,res){

  User.findOne({ 'username': req.body.username }, function(err, oldUser) {
      if(oldUser) {
        Arena.find({ isOpen: true }, function(err, arenas) {
          if (err) 
            throw err;
          res.render('arenas', { user : oldUser, arenas });
        });
      } else {
        User.create({ 'username': req.body.username }, function(err, newUser) {
          Arena.find({ isOpen: true }, function(err, arenas) {
            if (err) 
              throw err;
            res.render('arenas', { user : newUser, arenas });
          });
          
        });
      }
  });
  
});


// Game Room 
router.get('/selectionarena/:id/:userid',  function(req, res, next) {
  var arenaId = req.params.id;
  var userId = req.params.userid;
  Arena.findById(arenaId, function(err, arena) {
    
    User.findById(userId, function(err, oldUser) {
     
     // Room.getUsers(room, userId, function(err, allusers, cuntUserInRoom) {
      //  console.log(allusers);
        res.render('selectionarena', {  user : oldUser, arena });
     // });
    });
    
  });

  // Game Room 
router.get('/ninetysec/:id/:userid',  function(req, res, next) {
 
    var arenaId = req.params.id;
    var userId = req.params.userid;
    Arena.findById(arenaId, function(err, arena) {
   
      User.findById(userId, function(err, oldUser) {
     
           res.render('90sec', {  user : oldUser, arena });

       });
    });
  });



});


  // Game Room 
  router.get('/catchphrase/:id/:userid',  function(req, res, next) {
 
    var arenaId = req.params.id;
    var userId = req.params.userid;
    Arena.findById(arenaId, function(err, arena) {
   
      User.findById(userId, function(err, oldUser) {
     
           res.render('catchphrase', {  user : oldUser, arena });

       });
    });
  });


  router.get('/password/:id/:userid',  function(req, res, next) {
 
    var arenaId = req.params.id;
    var userId = req.params.userid;
    Arena.findById(arenaId, function(err, arena) {
   
      User.findById(userId, function(err, oldUser) {
     
           res.render('password', {  user : oldUser, arena });

       });
    });
  });




router.get("/catchphrasecreate", function(req,res){

  CatchPhrase.create({ "word": "India", "hint": "hint" }, function(err, newCp) {

   console.log(newCp);
  });

});



server.listen(3002,function(){
  console.log("Live at Port 3002");
});
