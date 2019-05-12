var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'isyerim',
	password: 'isyerim',
	database: 'isyerim'
});
global.db = db;

var app = express();

app.use(session({
	secret: 'hello world',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(cookieParser());



// helmet middlevare
var helmet = require('helmet');
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());


LocalStrategy = require('passport-local').Strategy;
passport.use('local', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
	} ,  //passback entire req to call back
	function (req, username, password, done){
		if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
		db.query("select * from users where username = ?", [username], function(err, rows){
				console.log(err);
			if (err) return done(req.flash('message',err));

			if(!rows.length){
				return done(null, false, req.flash('message','Invalid username or password.'));
			}
			var dbPassword  = rows[0].password;
			
			if(!(dbPassword == password)){
				return done(null, false, req.flash('message','Invalid username or password.'));
			}
			req.session.user = rows[0];
			return done(null, rows[0]);
		});
	}
));
passport.serializeUser(function(user, done){
	console.log(user);
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	db.query("select * from users where id = "+ id, function (err, rows){
		done(err, rows[0]);
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views'); // views klasoru root dizin
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
