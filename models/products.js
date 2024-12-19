const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  image_url: {
    type: String,
    // required: true,
    default: "https://cdn.pixabay.com/photo/2023/04/01/21/50/headphones-7893161_1280.jpg",

    get:(img) => {
        img === "" ? "https://cdn.pixabay.com/photo/2023/04/01/21/50/headphones-7893161_1280.jpg"
        : img;
    },
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
