import express from "express";
import productController from "../controllers/productController.mjs";

const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/:id").get(productController.getProduct);

export default router;
