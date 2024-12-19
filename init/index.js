const mongoose= require("mongoose");
const initData = require("./data.js");
const Products = require("../models/products.js");

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

const initDB = async () => {
    await Products.deleteMany({});
    console.log("everything deleted");
    await Products.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();