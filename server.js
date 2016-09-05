var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var myConnection = require('./config/connection');
var exphbs = require('express-handlebars');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var session = require('express-session');
// have to pass on a Store object on to the session
var SequelizeStore = require('connect-session-sequelize')(session.Store);
// using local strategy, and setting it up here to give options.
var mysql = require('mysql');

var LocalStrategy = require('passport-local').Strategy;
var importData = require('./config/orm.js')['exportData'];

// var db = require('./models/index.js').sequelize;
var models = require('./models');
var db = models.sequelize;
var enteredApplication;
var thisUser;
var data;

// this is used to sync the data

db.sync();

var User = models.User;
var Application = models.Application;

var app = express();

process.env.JAWSDB_URL = 'mysql://lc7r3bwce9cy16mn:gnaprt97jclnmqtu@uoa25ublaow4obx5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/bzilksa4rr2vj1zy';

var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

var companies = models.Companies;

 // module.exports =
 passport.use('local', new LocalStrategy(
  function(username, password, done) {
    User.findOne({where: {username: username} } ).then(function(user){
      if (!user){
        return done(null, false);
      }
           if (!user.username) {
             return done(null, false);
           }

           bcrypt.compare(password, user.password, function(err, result) {
             if (result) {
               return done(null, false);
             }
           })

           return done(null, user);
         })
         .catch(function(err) {
           throw err;
         })
       }
     ));

     passport.serializeUser(function(user, cb) {
       cb(null, user.id);
     });

     passport.deserializeUser(function(id, cb) {
       User.findOne( {where: {id: id} }).then(function(user) {
         cb(null, user);
       }).catch(function(err) {
         if (err) {
           return cb(err);
         }
       });
     });

     app.use(bodyParser.urlencoded({ extended: true }))
     app.use(bodyParser.json())
     app.use(cookieParser())
     app.use(session({
       secret: 'jobtroll is the ticket to success',
       store: new SequelizeStore({
         db: db
       }),
       resave: false,
       saveUninitialized: true
     }));
     app.use(passport.initialize());
     app.use(passport.session());

  //   /set up static files
     app.use('/static', express.static('public/assets'));

     app.engine('handlebars', exphbs({defaultLayout: 'main'}));
     app.set('view engine', 'handlebars');

     // ------------------------------------
     // ROUTES
     // ------------------------------------

//  ----- Log In  GET Request-------- //
     app.get('/', function (req, res) {
        res.render('mainpage');
      });

      app.get('/mainpage', function(req, res) {
        res.render('mainpage');
      });

     app.get('/login', function(req, res) {
       res.render('login');

     });

//     app.post('/login',
//        passport.authenticate('local'),
//        function(req, res) {
//          console.log('*****************************************************')
//          console.log(req.user.username)
//          // If this function gets called, authentication was successful.
//          // `req.user` contains the authenticated user.
//          res.redirect('/home');
//  });

  app.post('/login', passport.authenticate('local', {
	failureRedirect: '/login' }), function(req,res){
    req.session.save(function(){
        res.redirect('/home')
    })
  });

  app.get('/home', function (req, res){
      if (req.user) {
          Application.findAll({where: {UserId: req.user.id} }).then(function(success){
            enteredApplication = success;
          })
          data = {
            user: req.user,
            enteredApp: enteredApplication
          }
          res.render('home', {data: data});
          Application.findAll({where: {UserId: req.user.id} }).then(function(success){
            enteredApplication = success;
          })
    } else {
      		res.redirect('/login');
    }
  });

app.get('/dummy', function(req, res){
  if (req.user)
  {
          Application.findAll({where: {UserId: req.user.id} }).then(function(success){
            enteredApplication = success;
          })
          data = {
            user: req.user,
            enteredApp: enteredApplication
          }
  }
  res.redirect('/home');
});
// ----- Registration GET Request ------ //
     app.get('/register', function(req, res) {
     	res.render('register'); // uses register.handlebars
     });


     //Register user
     app.post('/register',function(req,res){
          models.User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
       //     Image: req.body.image
          }).then(function() {
            res.redirect('/');
          }).catch(function(err){
            throw err;
          });
     });


     app.get('/logout', function(req, res){
      //var name = req.user.username;
      req.logout();
      //console.log(name + "works");
      res.redirect('/');
     });


      app.get('/research', function(req,res){
        importData.selectAll(function(success){
        res.render('research',{data: success})

        })
      });

    //app.listen(8000)



// also want to give the option to login via Linkedin
//passport.use(new LinkedInStrategy({
//    consumerKey: 77d7l76s8dsyh4,
//    consumerSecret: CkQizFeB4onJWAAH,
//    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
//  },
//  function(token, tokenSecret, profile, done) {
//    User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
//      return done(err, user);
//    });
//  }
//));
app.post('/create', function(req, res){
  User.findOne({where: {id: req.user.id}}).then(function(){
    Application.create({
        companyName: req.body.companyName,
        position:req.body.position,
        dataApplied: req.body.dateApplied,
        replied:req.body.replied,
        nextEvent:req.body.nextEvent,
        notes:req.body.notes,
        resume:req.body.resume
  }).then(function(application){
    req.user.addApplication(application).then(function(){
    res.redirect('/dummy');
  }).catch(function(err){
    throw err;
  });
})
})
});

var PORT = process.env.PORT || 8000;

    app.listen(PORT, function () {
      console.log('database operation on port: ' + PORT);
     });

	// models.Manager.findOne({where: { fullName: name} })
	// // pass the manager in a callback function
	// .then(function(manager){
	// 	// then get that manager's stores using
	// 	// using the belongToMany() getAssociations method
	// 	return manager.getStores()
	// 	// use those stores in a callback function
	// 	.then(function(stores){
	// 		// and send the stores to the client as json
	// 		return res.json(stores);
	// 	})
	// })