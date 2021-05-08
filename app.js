var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
var moment = require('moment');
var cors = require('cors');
var bodyparser = require('body-parser');
var request = require('request');


var app = express();

process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
const config = require('config');
const MS = config.get('mysql');
const PORT = config.get('port');
const UTC_OFFSET = config.get('utcOffset');

// preparing sql statements
const GET_ALL_COUNT = `SELECT COUNT(*) AS count FROM ${MS.table};`;
const GET_ALL_ID = `SELECT DISTINCT id FROM ${MS.table} ORDER BY id asc;`;
const SELECT_BY_ID = `SELECT * FROM ${MS.table} WHERE id = ? ORDER BY id asc;`;
const SELECT_BY_AURTHOR = `SELECT * FROM ${MS.table} WHERE aurthor = ? ORDER BY id asc;`;
const INSERT = `INSERT INTO ${MS.table} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
// VALUES(id, html, css, javascript, html_content, css_content, javascript_content, aurthor, descriptions, updated)

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
    results.forEach(r => {
        console.log(JSON.stringify(r));
    });
});

//moment for formating mysql datetime
moment().utcOffset(UTC_OFFSET).format('YYYY-MM-DD HH:mm:ss');

// app setup
// using ejs views for dynamic pages
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
// set static directory
app.use(cors());
app.use(express.static(__dirname + '/public'));
// setting express session for user login/logout
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// setting cache control to do not allow any disk cache 
// to prevent reload page without login
// pre: res != null
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

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
    console.log('app listening on port '+PORT+'!');
});