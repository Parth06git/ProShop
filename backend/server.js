import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";
import cors from 'cors'

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors())

app.get("/", (req, res) => {
  res.send("Prachi Trivedi");
});
app.get("/api/products", (req, res) => {
  res.send(products);
});
app.get("/api/products/:id", (req, res) => {
  const product = products.find((el) => el._id === req.params.id);
  res.send(product);
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
