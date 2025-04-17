const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/cashier", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Model
const productSchema = new mongoose.Schema({
  name: String,
  barcode: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);

// Sales Model
const saleSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now },
});
const Sale = mongoose.model("Sale", saleSchema);

// Routes
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/products/:barcode", async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });
  if (!product) return res.status(404).send("Product not found");
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

app.put("/api/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.post("/api/sales", async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

app.get("/api/sales", async (req, res) => {
  const sales = await Sale.find().sort({ date: -1 });
  res.json(sales);
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
