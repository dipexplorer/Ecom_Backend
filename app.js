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
const listing = require("./routes/listing.js");

const admin = require("./routes/admin_panel.js");


//SESSIONS MANAGEMENt
const session= require("express-session");

//FLash after adding
const flash = require("connect-flash");

const sessionOptions ={
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true
    }
};

// Test API
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(session(sessionOptions));
//use flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
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

const MONGO_DB_URL = "mongodb://127.0.0.1:27017/e_commerce";

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch(err=>{
    console.error("Failed to connect to MongoDB", err);
});

async function main(){
    await mongoose.connect(MONGO_DB_URL);
};

// ROUTES
app.use("/products",listing);
app.use("/adminDashboard",admin);

app.get('/login', (req, res) => {
    res.render('./products/login.ejs');
});

app.get('/register', (req, res) => {
    res.render('./products/register.ejs');
});

// (err, req, res, next) — with the error object (err) being the first parameter.
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.render("error.ejs", {err});
});

//page not found
app.all("*", (req, res, next) => {
    const err = new expressError(404, "Page not found");
    next(err);
  });

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));