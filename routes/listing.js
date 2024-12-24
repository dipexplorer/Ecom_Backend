const express = require("express");
const router = express.Router();
const Product = require("../models/products.js");

const Order = require("../models/order.js");
const User = require("../models/user.js");

const { productSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");
// middleware
const { isLoggedIn } = require("../middleware");

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

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allProducts = await Product.find({});
    // res.json(allProducts);
    // console.log(allProducts);
    res.render("products/index.ejs", { allProducts });
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found");
      res.redirect("/products");
    }
    res.render("products/show.ejs", { product });
  })
);

//checkout page

router.get(
  "/:id/checkout",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ExpressError("Product not found", 404));

    res.render("products/checkout.ejs", { product });
  })
);

// placed order
router.post(
    "/:id/order",
    isLoggedIn,
    wrapAsync(async (req, res, next) => {
      // Retrieve the currently logged-in user
      const user = req.user;
      if (!user) return next(new ExpressError("User not found", 404));
  
      // Retrieve the user from the database
      const validUser = await User.findById(user._id);
  
      // Check if the user has a valid address
      const address = validUser.address || {};
      const requiredFields = ["street", "city", "state", "postalCode", "country"];
      const isAddressComplete = requiredFields.every(
        (field) => address[field] && address[field].trim() !== ""
      );
  
      if (!isAddressComplete) {
        req.flash("error", "Please update your address before placing an order.");
        return res.redirect("/profile/edit");
      }
  
      // Retrieve the product
      const product = await Product.findById(req.params.id);
      if (!product) return next(new ExpressError("Product not found", 404));
  
      // Validate the order quantity
      const { quantity } = req.body;
      if (!quantity || quantity <= 0) {
        req.flash("error", "Quantity must be greater than 0.");
        return res.redirect(`/products/${req.params.id}`);
      }
  
      // Calculate the total amount
      const totalAmount = quantity * product.price;
  
      // Create a new order
      const order = new Order({
        user: user._id,
        products: [{ product: product._id, quantity }],
        totalAmount,
      });
  
      // Save the order to the database
      const savedOrder = await order.save();
  
      // Link the order to the user's profile
      validUser.orders = validUser.orders || [];
      validUser.orders.push(savedOrder._id);
      await validUser.save();
  
      req.flash("success", "Order placed successfully!");
      res.redirect(`/products/${product._id}`);
    })
  );
  

module.exports = router;
