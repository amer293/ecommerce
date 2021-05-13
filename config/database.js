// Require stuff
var mysql = require('mysql');

// Use DotEnv file
require('dotenv').config();

// Database connection
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

conn.connect( (err) => {
    if(err) throw err;
    console.log('Database connected successfully: '+process.env.DB_NAME);
})

module.exports = conn