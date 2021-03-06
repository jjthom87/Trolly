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
var importData = require('./config/researchData.js')['exportData'];

// this is used to sync the data
var models = require('./models');
var db = models.sequelize;
db.sync();

var User = models.User;
var Application = models.Application;
var Companies = models.Companies;

var app = express();

 // module.exports =
 // passport.use('local', new LocalStrategy(
 //  function(username, password, done) {
 //    User.findOne({where: {username: username} } ).then(function(user){
 //      if (!user){
 //        return done(null, false);
 //      }
 //           if (!user.username) {
 //             return done(null, false);
 //           }

 //           bcrypt.compare(password, user.password, function(err, result) {
 //             if (result) {
 //               return done(null, false);
 //             }
 //           })

 //           return done(null, user);
 //         })
 //         .catch(function(err) {
 //           throw err;
 //         })
 //       }
 //     ));

passport.serializeUser(function(user,done){
  done(null, user);
 });

passport.deserializeUser(function(obj,done){
  done(null, obj);
 });

module.exports = 
passport.use('local', new LocalStrategy(
  function(username, password, done){
    User.findOne({ where: {username: username}}).then(function(user){
        if (!user){
          return done(null, false, {message: 'Incorrect Username'});
        }
        // var correctPassword = user.password;

        // if (password !== correctPassword){
        //   return done(null, false, {message: 'incorrect password'});
        // }
        if (user.password !== password){
          return done(null, false, {message: 'incorrect password'});
        }
        return done(null, user)
      });
    }
));

     // passport.serializeUser(function(user, cb) {
     //   cb(null, user.id);
     // });

     // passport.deserializeUser(function(id, cb) {
     //   User.findOne( {where: {id: id} }).then(function(user) {
     //     cb(null, user);
     //   }).catch(function(err) {
     //     if (err) {
     //       return cb(err);
     //     }
     //   });
     // });

     app.use(bodyParser.urlencoded({ extended: true }))
     app.use(bodyParser.json())
     app.use(cookieParser())
     app.use(session({
       secret: 'jobtroll is the ticket to success',
       // store: new SequelizeStore({
       //   db: db
       // }),
       resave: true,
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

  app.post('/login', 
    passport.authenticate('local', {
      successRedirect: '/home',
	    failureRedirect: '/login'
    })
  );

  app.get('/home', function (req, res){
        if (!req.isAuthenticated()){
            req.session.error = 'Please sign in!';
            res.redirect('/login');
            return false;
          };
          User.findOne({ where: {id: req.user.id}}).then(function(user){
            user.getApplications().then(function(apps){
            var enteredApplications = [];

          apps.forEach(function(app){
            enteredApplications.push(app);
          })
          var data = {
            user: req.user,
            enteredApp: enteredApplications
          }
          res.render('home', {data: data});
        });
      });
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
  req.logout();
  res.redirect('/');
 });


app.get('/research', function(req,res){
  importData.selectAll(function(success){
  res.render('research',{data: success})

  })
});



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
        res.redirect('/home');
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