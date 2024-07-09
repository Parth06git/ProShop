import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongo from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import globalErrorHandler from "./controllers/errorController.mjs";

dotenv.config();

const port = process.env.PORT || 5000;

connectToMongo();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Parth Trivedi");
});
app.use("/api/products", productRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
