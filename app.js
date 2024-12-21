const express=require("express");
const app = express();
const mongoose=require("mongoose");
const Product = require("./models/products.js");

//for ejs rendering
const path = require("path");

app.set("view engine", "ejs");
// Set up template engine for EJS
app.set("views", path.join(__dirname,"views"));

// for body parsing means that body is parsed as JSON instead of a string
app.use(express.urlencoded({extended:true}));

// for static files
app.use(express.static(path.join(__dirname, "public")));

// update product
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const ejsMate = require("ejs-Mate");
app.engine('ejs',ejsMate);

// error handling
const warpAsync = require("./utils/wrapAsync.js");
const wrapAsync = require("./utils/wrapAsync.js");

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
}

// Test API
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get("/products", wrapAsync(async (req, res) => {
        const allProducts = await Product.find({});
        // res.json(allProducts);
        // console.log(allProducts);
        res.render("products/index.ejs", {allProducts});
}));

app.get("/products/:id", wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send("Product not found");
    res.render("products/show.ejs", {product});
}));

//admin
app.get("/adminDashboard",async (req, res)=>{
    const allProducts = await Product.find({});
    res.render("products/adminDashboard.ejs",{product : allProducts});
});

//add product
app.get("/adminDashboard/addProduct", (req, res) => {
    res.render("products/new.ejs");
});

app.get("/adminDashboard/:id", wrapAsync(async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send("Product not found");
    res.render("products/admin_view.ejs", {product});

}));

app.post("/adminDashboard/addProduct", wrapAsync(async (req, res) => {
    let product = req.body.product;
    // console.log(product);
    const newProduct = new Product(product);
    newProduct.save();
    res.redirect("/adminDashboard");
}));

app.get("/adminDashboard/:id/update", wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send("Product not found");
    res.render("products/update.ejs", {product});
}));

// update the product
app.put("/adminDashboard/:id/update", wrapAsync(async (req, res) => {
    let product = req.body.product;
    await Product.findByIdAndUpdate(req.params.id, product);
    res.redirect(`/adminDashboard/${req.params.id}`);
}));

//delete product
app.delete("/adminDashboard/:id", wrapAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/adminDashboard");

}));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));