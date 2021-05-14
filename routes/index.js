const { render } = require('ejs');
let express = require('express');
let router = express.Router();
let conn = require('../config/database');

// Get homepage
router.get('/', (req, res) => {
    
    let stmt = "SELECT * FROM product ORDER BY RAND () LIMIT 6"
    conn.query(stmt, (err, product) => {
        if(err) throw err
        console.log(product)
        
        let stmt = "SELECT * FROM category ORDER BY id ASC"
        conn.query(stmt, (err, category) => {
            if(err) throw err
            console.log(category)
            res.render('index', {product: product, category: category})
    
        })
    })
})

module.exports = router