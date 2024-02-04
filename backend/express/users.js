const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { mongoose, User, Product } = require("../mongoose/db_connect");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUser = new User({ userName, email, hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product
app.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { name, price, description, imageUrl } = req.body;
    const newProduct = new Product({ name, price, description });

    if (req.file) {
      const imagePath = "/uploads/" + req.file.filename;
      newProduct.imageFile = imagePath;
    }

    if (imageUrl) {
      newProduct.imageUrl = imageUrl;
    }

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all products
app.get("/getProducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product
app.put(
  "/updateProduct/:productId",
  upload.single("image"),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const { name, price, description, imageUrl } = req.body;

      let updatedProduct = {
        name,
        price,
        description,
      };

      if (req.file) {
        updatedProduct.imageFile = "/uploads/" + req.file.filename;
      } else if (imageUrl) {
        updatedProduct.imageUrl = imageUrl;
      }

      await Product.findByIdAndUpdate(productId, updatedProduct);
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a product
app.delete("/deleteProduct/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user information
app.put("/updateUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userName, email, password } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user information
    user.userName = userName;
    user.email = email;
    if (password) {
      user.hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
