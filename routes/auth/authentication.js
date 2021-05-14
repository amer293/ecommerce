const { response } = require('express');
let express = require('express');
let router = express.Router();
let conn = require('../../config/database');




// Registration
// -------------------------------------------------------------
// Render Registration page
router.get('/register', (req, res) => {

    let stmt = "SELECT * FROM category ORDER BY id ASC"
    conn.query(stmt, (err, category) => {
        if(err) throw err
        console.log(category)
        res.render('register', {category: category})

    })
    
})

// Sends data as a post request to the database for insertion
// requires fname, lname, email, password to be able to insert
router.post('/register/new', (req, res) => {

    // User information
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let info = [username, password, email];

    console.log(info)

    // Query checks if an email exits in the database if so then return 1
    let stmt1 = 'SELECT COUNT(*) FROM user WHERE email = ?';
    conn.query(stmt1, email, (err, response) => {
        if (err) throw err
        var existsOrNot = JSON.stringify(response).split('"')[2].substring(1, 2)
        console.log(existsOrNot)

        // checks if the response is equal to 1 if not continue
        if (existsOrNot == 1) {
            console.log("Exists");

        } else {
            // Inserts the user in to the database
            var stmt2 = 'INSERT INTO user(username, password, email) VALUES(?, SHA(?), ?)';
            conn.query(stmt2, info, (err) => {
                if (err) throw err
                res.redirect('/');
            })
        }
    })


})

// Login
// -------------------------------------------------------------
// Render Login page
router.get('/login', (req, res) => {

    let stmt = "SELECT * FROM category ORDER BY id ASC"
    conn.query(stmt, (err, category) => {
        if(err) throw err
        console.log(category)
        res.render('login', {category: category})

    })
    
})

// User needs to provide email and password to be able to login
router.post('/login/user', (req, res) => {

    // Grabs the values from the inputs
    let username = req.body.username;
    let password = req.body.password;

    // Puts user information in array for easier sql
    let info = [username, password];

    // check the user username and password
    stmt = 'SELECT id, username, password FROM user WHERE username = ? AND password = SHA(?)';
    conn.query(stmt, info, (err, response) => {

        if (response == '') {
            console.log('Combinations dont match');

        } else {
            // If the password and username matches then start a session with the user id and redirect to profile page
            req.session.userId = response[0].id;
            console.log(req.session.userId)

            res.redirect('/');
            
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