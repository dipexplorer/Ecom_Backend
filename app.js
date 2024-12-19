const express=require("express");
const app = express();
const mongoose=require("mongoose");
const Product = require("./models/products.js");

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

// User Schema
app.get("/testSchema",async (req, res) => {
    try{
        let sampleProduct = new Product({
            name: "Sample Product",
            description: "This is a sample product for testing purposes.",
            price: 99.99,
            stock: 100,
            image_url: "ass"
        });
        await sampleProduct.save();
        console.log("Sample Product saved");
        res.send("Sample Product created successfully");
    }
    catch(err){
        res.send( err.message );
    }
});


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));