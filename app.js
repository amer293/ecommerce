// Require stuff
var express = require('express');
var path = require('path');
var session = require('express-session');

// Set port 
const httpsPort = 3000;

// Initilize express
var app = express()


// Engine setup (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
require('dotenv').config()
app.use(session({ 
    resave: false, 
    secret: process.env.SECRET_SESSION, 
    saveUninitialized: false,
    maxAge: 172800000
}));

// Set userId to global variable
app.use(function(req, res, next) {
    res.locals.user = req.session.userId;
    next();
});

// Declare routes
var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth/authentication');

// Use routes
app.use('/', indexRoute);
app.use('/', authRoute);

//Listen to server
app.listen(httpsPort, () => {
    console.log('Server on '+httpsPort);
});


