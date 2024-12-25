const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const Product = require("../models/products.js");
const User = require("../models/user.js");
const Order = require("../models/order.js");
const { isLoggedIn } = require("../middleware");
const expressError = require("../utils/expressError.js");

// error handling
const wrapAsync = require("../utils/wrapAsync.js");


router.get("/", isLoggedIn, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    req.flash("info", "Your cart is empty");
  }

  res.render("products/cart.ejs", { cart });
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { productId } = req.body;

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/products");
  }

  // Find or create a cart for the logged-in user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if the product is already in the cart
  const existingItem = cart.items.find((item) =>
    item.product.equals(productId)
  );

  if (existingItem) {
    // Increment the quantity if the item exists
    existingItem.quantity++;
  } else {
    // Add a new item to the cart
    cart.items.push({ product: productId, quantity: 1 });
  }

  await cart.save();

  req.flash("success", "Product added to cart");
  res.redirect("/products");
});

// Update item quantity in the cart
router.put("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const newQuantity = parseInt(req.body.quantity, 10);

    if (newQuantity < 1) {
      return res.status(400).send("Quantity must be at least 1");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res.status(404).send("Product not found in cart");
    }

    item.quantity = newQuantity;
    await cart.save();

    res.redirect("/cart"); // Redirect to the cart page after updating
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Remove item from the cart
router.delete("/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.redirect("/cart"); // Redirect to the cart page after removal
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// Checkout route - Place order for all items in the cart
router.post("/checkout", isLoggedIn, wrapAsync(async (req, res, next) => {
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
  
    // Retrieve the cart
    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/cart");
    }
  
    // Create the order
    let totalAmount = 0;
    const products = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    });
  
    // Create the order
    const order = new Order({
      user: user._id,
      products,
      totalAmount,
      shippingAddress: address,
    });
  
    // Save the order to the database
    const savedOrder = await order.save();
  
    // Clear the cart
    cart.items = [];
    await cart.save();
  
    // Link the order to the user's profile
    validUser.orders = validUser.orders || [];
    validUser.orders.push(savedOrder._id);
    await validUser.save();
  
    req.flash("success", "Order placed successfully!");
    res.redirect("/profile/orders");
  }));


module.exports = router;