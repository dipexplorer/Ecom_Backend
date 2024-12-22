const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  contactNumber: {
    type: Number,
    match: [/^\d{10}$/, "Please enter a valid contact number"],
  },
  // Field for checking the admin
  isAdmin: {
    // Add this field
    type: Boolean,
    default: false, // Default is false for regular users
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
