const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const expressError = require("../utils/expressError.js");

//passport setup
const passport = require("passport");

// error handling
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl , isLoggedIn} = require("../middleware.js");

// Controller
router.get("/login", (req, res) => {
  res.render("products/login");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, password, email } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Logged in Successfully");
        res.redirect("/products");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/login");
    }
  })
);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    // successRedirect: res.location.redirectUrl,
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Logged in Successfully");
    res.redirect(res.locals.redirectUrl || "/products");
  }
);

router.get("/logout",(req, res,next) => {
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Logged Out Successfully");
    res.redirect("/products");
  })
});

//get user update form

router.get("/profile", isLoggedIn, wrapAsync(async (req, res) => {
  res.render("products/profile.ejs", { user: req.user });
}));

// update form
router.get("/profile/edit", isLoggedIn, wrapAsync(async (req, res) => {
  res.render("products/editProfile.ejs", { user: req.user });
}));

//update user data

router.put("/profile/edit/:id", isLoggedIn, wrapAsync(async (req, res, next) => {
  if(!req.body.user){
    throw new expressError(400, "Send valid data");
  }
  let user = req.body.user;
  // console.log(user);
  await User.findByIdAndUpdate(req.user._id, user);
  //flash message
  req.flash("success", "Profile updated successfully!");
  res.redirect("/profile");
}));

// delete user
router.delete("/profile/:id", isLoggedIn, wrapAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "Account deleted successfully!");
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Logged Out Successfully");
    res.redirect("/login");
  })
}));

// view orders

router.get("/orders", isLoggedIn, wrapAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("product");
  res.render("products/orders.ejs", { orders });
}));

module.exports = router;
