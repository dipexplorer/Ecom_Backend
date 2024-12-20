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

app.get("/products", async (req, res) => {
    try{
        const allProducts = await Product.find({});
        // res.json(allProducts);
        // console.log(allProducts);
        res.render("products/index.ejs", {allProducts});
    }
    catch(err){
        res.send(err.message);
    }
});

app.get("/products/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).send("Product not found");
        res.render("products/show.ejs", {product});
    }
    catch(err){
        res.send(err.message);
    }
});

// // User Schema
// app.get("/testSchema",async (req, res) => {
//     try{
//         let sampleProduct = new Product({
//             name: "Sample Product",
//             description: "This is a sample product for testing purposes.",
//             price: 99.99,
//             stock: 100,
//             image_url: "ass"
//         });
//         await sampleProduct.save();
//         console.log("Sample Product saved");
//         res.send("Sample Product created successfully");
//     }
//     catch(err){
//         res.send( err.message );
//     }
// });


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));