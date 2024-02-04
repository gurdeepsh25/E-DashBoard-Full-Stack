const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/E-Dashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  hashedPassword: String,
});

const productsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageFile: String,
  imageUrl: String,
});

const User = mongoose.model("User", usersSchema);
const Product = mongoose.model("Product", productsSchema);

module.exports = { mongoose, User, Product };
