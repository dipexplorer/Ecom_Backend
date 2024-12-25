if(process.env.NODE_ENV!="production") { //not to deploy .env file while uploading to git
    require('dotenv').config();
}
const express=require("express");
const app = express();
const mongoose=require("mongoose");
const Product = require("./models/products.js");
//JOI serverside schema validation
const { productSchema } = require("./schema.js");
// update product
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
// error handling
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const Cart = require("./models/cart.js");

//for ejs rendering
const listingRouter = require("./routes/listing.js");
const adminRouter = require("./routes/admin_panel.js");
const userRouter = require("./routes/user.js");
const cartRoutes = require("./routes/cart.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//SESSIONS MANAGEMENt
const session= require("express-session");

//FLash after adding
const flash = require("connect-flash");

const sessionOptions ={
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
    }
};

const MONGO_DB_URL = process.env.DATABASE_URL;
// Use environment variables
const PORT = process.env.PORT || 3000;


// Test API
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(session(sessionOptions));
//use flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null; //currentUser is available in all templates
    if (req.user) {
        const cart = await Cart.findOne({ user: req.user._id });
        res.locals.cartCount = cart 
          ? cart.items.reduce((sum, item) => sum + item.quantity, 0) 
          : 0;
      } else {
        res.locals.cartCount = 0;
      }
    // console.log(req.user);
    next();
});


//for ejs rendering
const path = require("path");
app.set("view engine", "ejs");
// Set up template engine for EJS
app.set("views", path.join(__dirname,"views"));
// for body parsing means that body is parsed as JSON instead of a string
app.use(express.urlencoded({extended:true}));
// for static files
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


async function main(){
    await mongoose.connect(MONGO_DB_URL);
    console.log("Connected to MongoDB");
};

main().catch(err => console.log(err));

// ROUTES
app.use("/products",listingRouter);
app.use("/adminDashboard",adminRouter);
app.use("/",userRouter);
app.use("/cart", cartRoutes);

// (err, req, res, next) — with the error object (err) being the first parameter.
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.render("error.ejs");
});

//page not found
app.all("*", (err, req, res, next) => {
    res.render("products/nopage.ejs");
    next(err);
 });

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));