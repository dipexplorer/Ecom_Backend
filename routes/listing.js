const express = require('express');
const router = express.Router();
const Product = require("../models/products.js");
const { productSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");

// error handling
const wrapAsync = require("../utils/wrapAsync.js");

const validateProduct=(req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(errMsg, 400);
    }
    next();
}

router.get("/", wrapAsync(async (req, res) => {
    const allProducts = await Product.find({});
    // res.json(allProducts);
    // console.log(allProducts);
    res.render("products/index.ejs", {allProducts});
}));

router.get("/:id", wrapAsync(async (req, res) => {
const product = await Product.findById(req.params.id);
if(!product) {
    req.flash('error','Product not found');
    res.redirect('/products');    
}
res.render("products/show.ejs", {product});
}));

module.exports = router;