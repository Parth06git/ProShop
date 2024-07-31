import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongo from "./config/db.js";
import globalErrorHandler from "./controllers/errorController.mjs";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import AppError from "./utils/appError.mjs";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT || 5000;

connectToMongo();

const app = express();

const __dirname = path.resolve(); // set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads")));
app.set("view engine", "jsx");
app.set("views", path.join(__dirname, "frontend/src/screens"));

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID })); // Route should be similar for all application

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
}

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
