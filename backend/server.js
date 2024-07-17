import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongo from "./config/db.js";
import globalErrorHandler from "./controllers/errorController.mjs";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import AppError from "./utils/appError.mjs";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT || 5000;

connectToMongo();

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Parth Trivedi");
});
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
