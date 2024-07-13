import Product from "../models/ProductModel.js";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";

const productController = {
  // @desc    Fetch all products
  // @route   GET /api/products
  // @access  Public
  getAllProducts: catchAsync(async (req, res) => {
    const products = await Product.find();
    res.json(products);
  }),

  // @desc    Fetch single product
  // @route   GET /api/products/:id
  // @access  Public
  getProduct: catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Page Not Found", 404));
    }
    res.json(product);
  }),
};

export default productController;
