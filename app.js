const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const helmet  = require('helmet');
const moment  = require('moment');
const morgan  = require('morgan');
const mysql   = require('mysql');
const path    = require('path');
const request = require('request');

var app = express();

// reading configurations from config directory
process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
const config    = require('config');
const MS        = config.get('mysql');
const PORT      = config.get('port');
const UTC_OFFSET = config.get('utcOffset');

// preparing sql statements
const GET_ALL_COUNT = `SELECT COUNT(*) AS count FROM ${MS.table};`;

// connect to mysql database
var connection = mysql.createConnection({
    host     : MS.host,
    user     : MS.user,
    password : MS.password,
    database : MS.database
});

// mysql query (async)
var queryResult = connection.query(GET_ALL_COUNT, function (error, results, fields) {
    if (error) throw error;
    console.log("mysql query results:");
    results.forEach(r => {
        console.log("\t"+JSON.stringify(r));
    });
});

// moment formating current datetime in mysql datetime style
var time = moment().utcOffset(UTC_OFFSET).format('YYYY-MM-DD HH:mm:ss');

// request http calls 
request
    .get('https://example.com')
    .on('response', function(response) {
        console.log(`request status : ${response.statusCode}`);
        console.log(`request type   : ${response.headers['content-type']}`);
    })

// app setup
// using ejs views for dynamic pages
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
// using HTTP request logger middleware
app.use(morgan("common"));
// using secure HTTP headers middleware
app.use(helmet());
// using CORS middleware (allowing all CORS)
app.use(cors());
// setting static directory
app.use(express.static(__dirname + '/public'));
// setting express session for user login/logout
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// setting cache control to do not allow any disk cache 
// to prevent reload page without login
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});
// using parsing middlewares for urlencoded and json payloads 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// get methods
// send simple text, url: http://localhost:3000
app.get('/', function (req, res) {res.send("Hello!")}); 
// using input params, url: http://localhost:3000/id/ENTER_A_NUMBER
app.get('/id/:id', function (req, res) {res.send("Your ID is "+req.params.id)}); 
// send file, url: http://localhost:3000/image
app.get('/image', function (req, res) {res.sendFile(path.join(__dirname,'/public/images/trollface.png'))}); 
// inject and render view, url: http://localhost:3000/user
app.get('/user', function(req, res) {
    res.render('sample',{username:req.session.username, message:req.session.message});
});

// post methods
// collecting username and set message, triggered by /user
app.post('/login', function(req, res) {
    var username = req.body.username.trim();
	var password = req.body.password.trim();
    if(req.session.loggedin) {
        req.session.message = "you've already logged in...";
    } else if (username && password==="123"){
        req.session.loggedin = true;
        req.session.username = username;
        req.session.message = "you're now logged in";
    } else {
        req.session.message = "wrong password";
    }
    res.redirect('/user');
}); 
// removing username and set message, triggered by /user
app.post('/logout', function(req, res) {
    if(req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = "";
        req.session.message = "you're now logged out";
    } else{
        req.session.message = "you haven't logged in yet...";
    }
    res.redirect('/user');
}); 

// start server on port specified in config
app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`);
    console.log(`app starting at ${time}`)
});