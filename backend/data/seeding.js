import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./user.js";
import products from "./products.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import connectToMongo from "../config/db.js";

dotenv.config();

connectToMongo();

const importData = async () => {
  try {
    const createdUser = await User.insertMany(users);

    const adminUser = createdUser[0]._id;

    const sampleProducts = products.map((el) => {
      return { ...el, user: adminUser };
    });

    await Product.create(sampleProducts);

    console.log("Data is successfully loaded in db".green.inverse);
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    console.log("Data is successfully deleted from db".green.inverse);
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
