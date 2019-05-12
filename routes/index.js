var express = require('express');
var mysql = require('mysql');
var passport = require('passport');


var router = express.Router();

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}



// home page
router.get('/', function(req, res, next) {
	res.render('home', {
		isAuth: req.isAuthenticated(),
		title: 'HATSAT',
	});
});

router.get('/products', function(req, res, next) {
	res.render('pages/products', {
		isAuth: req.isAuthenticated(),
		title: 'Products',
	});
});
router.get('/about', function(req, res, next) {
	res.render('pages/about', {
		isAuth: req.isAuthenticated(),
		title: 'About',
	});
});
router.get('/contact', function(req, res, next) {
	res.render('pages/contact', {
		isAuth: req.isAuthenticated(),
		title: 'Contact',
	});
});
router.get('/referances', function(req, res, next) {
	res.render('pages/referances', {
		isAuth: req.isAuthenticated(),
		title: 'Referances',
	});
});


// list news
router.get("/news", function(req, res) {
	db.query("SELECT * FROM haberler", function (err, result, fields) {
		if (err) throw err;
		res.render("pages/news", {
			veri: result,
			isAuth: req.isAuthenticated()
		});
	});
});

// get login page
router.get('/login', function(req, res, next) {
	res.render('pages/login', {
		isAuth: req.isAuthenticated(),
		title: 'Login',
	});
});
// login to system
router.post('/login', passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/login",
	failureFlash: true
}));
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});
// get register page
router.get('/register', function(req, res, next) {
	res.render('pages/register', {
		isAuth: req.isAuthenticated(),
		title: 'Register',
	});
});
// add user post request
router.post('/register', function(req, res, next) {
	if(req.body.password == req.body.passwordconfirm) {
		sql = "INSERT INTO users VALUES (" +
			"null," +
			"'" + req.body.username + "'," +
			"'" + req.body.password +"'," +
			"'" + req.body.name + "'," +
			"'" + req.body.email + "'," +
			"'member');";
		console.log(sql);
		db.query(sql, function (err, result, fields) {
			if (err) throw err;
			res.render("/home", {veri: result});
		});
	} else {
		res.render("register");
	}
});
router.get('/dashboard', isAuthenticated, function(req, res, next) {
	res.render('pages/dashboard', {
		isAuth: req.isAuthenticated(),
		title: 'profile',
	});
});

router.post('/addnew', isAuthenticated, function(req, res, next) {
	sql = "INSERT INTO haberler VALUES (null, '" + req.body.title + "', '"+ req.body.content + "');"
	console.log(sql);
	console.log(req.body.title);
	console.log(req.body.content);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		res.redirect("/news");
	});
});


// list news
router.get("/iletisim", function(req, res) {
	db.query("SELECT * FROM iletisim", function (err, result, fields) {
		if (err) throw err;
		res.render("pages/iletisim", {
			veri: result,
			isAuth: req.isAuthenticated()
		});
	});
});

router.post('/iletisim', function(req, res, next) {
	sql = "INSERT INTO iletisim VALUES (null," 
	+ "'" + req.body.isim + "',"
	+ "'" + req.body.soyisim + "',"
	+ "'" + req.body.email + "',"
	+ "'" + req.body.tel + "',"
	+ "'" + req.body.mesaj + "');"
	console.log("========================================================");
	console.log(sql);
	console.log(req.body.title);
	console.log(req.body.content);
	db.query(sql, function (err, result, fields) {
		if (err) throw err;
		res.redirect("/");
	});
});

module.exports = router;
