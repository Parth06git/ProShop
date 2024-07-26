import express from "express";
import productController from "../controllers/productController.mjs";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(userController.protect, productController.createProduct);
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(userController.protect, productController.updateProduct)
  .delete(userController.protect, productController.deleteProduct);

export default router;
