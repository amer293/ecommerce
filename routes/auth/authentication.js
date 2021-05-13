const { response } = require('express');
var express = require('express');
var router = express.Router();
var conn = require('../../config/database');




// Registration
// -------------------------------------------------------------
// Render Registration page
router.get('/register', (req, res) => {

    res.render('register');
})

// Sends data as a post request to the database for insertion
// requires fname, lname, email, password to be able to insert
router.post('/register/new', (req, res) => {

    // User information
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var city = req.body.city;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var email = req.body.email;
    var password = req.body.password;

    var info = [first_name, last_name ,username,  password, city, state, zipcode, email];

    console.log(info)

    // Query checks if an email exits in the database if so then return 1
    var stmt1 = 'SELECT COUNT(*) FROM user WHERE email = ?';
    conn.query(stmt1, email, (err, response) => {
        if (err) throw err
        var existsOrNot = JSON.stringify(response).split('"')[2].substring(1, 2)
        console.log(existsOrNot)

        // checks if the response is equal to 1 if not continue
        if (existsOrNot == 1) {
            console.log("Exists");

        } else {
            // Inserts the user in to the database
            var stmt2 = 'INSERT INTO user(first_name, last_name, username, password,  city, state,  zipcode, email) VALUES(?, ?, ?, SHA(?), ?, ?, ?, ?)';
            conn.query(stmt2, info, (err) => {
                if (err) throw err
                res.redirect('/');
            })
        }
    })


})

// Login
// -------------------------------------------------------------

// User needs to provide email and password to be able to login
router.post('/login/user', (req, res) => {

    // Grabs the values from the inputs
    var username = req.body.username;
    var password = req.body.password;

    // Puts user information in array for easier sql
    var info = [username, password];

    // check the user username and password
    stmt = 'SELECT id, username, password FROM user WHERE username = ? AND password = SHA(?)';
    conn.query(stmt, info, (err, response) => {

        if (response == '') {
            console.log('Combinations dont match');

        } else {
            // If the password and username matches then start a session with the user id and redirect to profile page
            req.session.userId = response[0].id;
            console.log(req.session.userId)

            res.redirect('/account/'+response[0].id);
            
        }


    })
})


// Loads up profile page information
router.get('/logout', (req, res) => {

    req.session.destroy(function(err) {
        if(err) throw err;
        res.redirect('/');
    })


})


module.exports = router