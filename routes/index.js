const { render } = require('ejs');
var express = require('express');
var router = express.Router();
var conn = require('../config/database');

// Get homepage
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router