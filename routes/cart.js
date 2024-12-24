const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/products.js");
const { isLoggedIn } = require("../middleware");

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

module.exports = router;
