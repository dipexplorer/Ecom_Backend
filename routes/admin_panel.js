const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");
const { productSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");

// error handling
const wrapAsync = require("../utils/wrapAsync.js");

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(errMsg, 400);
  }
  next();
};

//admin
router.get("/", async (req, res) => {
  const allProducts = await Product.find({});
  res.render("products/adminDashboard.ejs", { product: allProducts });
});

//add product
router.get("/addProduct", (req, res) => {
  res.render("products/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    //flash
    if(!product){
      req.flash('error',"Product not found!");
      return res.redirect("/adminDashboard");
    }
    res.render("products/admin_view.ejs", { product });
  })
);

router.post(
  "/addProduct",
  validateProduct,
  wrapAsync(async (req, res) => {
    let product = req.body.product;
    const newProduct = new Product(product);
    await newProduct.save();
    //flash message
    req.flash('success',"New Product added successfully!");
    res.redirect("/adminDashboard");
  })
);

router.get(
  "/:id/update",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product){
      req.flash('error',"Product not found!");
      return res.redirect("/adminDashboard");
    }
    res.render("products/update.ejs", { product });
  })
);

// update the product
router.put(
  "/:id/update",
  wrapAsync(async (req, res) => {
    if (!req.body.product) {
      throw new expressError(400, "Send valid data");
    }
    let product = req.body.product;
    await Product.findByIdAndUpdate(req.params.id, product);
    //flash message
    req.flash('success',"Product updated successfully!");
    res.redirect(`/adminDashboard/${req.params.id}`);
  })
);

//delete product
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    //flash message
    req.flash('success',"Product deleted successfully!");
    res.redirect("/adminDashboard");
  })
);



module.exports = router;
