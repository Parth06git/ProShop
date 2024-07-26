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

  // @desc    Create a product
  // @route   POST /api/products
  // @access  Private(Admin)
  createProduct: catchAsync(async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(new AppError("You are not authorize for this action", 401));
    }

    const product = new Product(req.body);

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }),

  // @desc    Update a product
  // @route   PATCH /api/products
  // @access  Private(Admin)
  updateProduct: catchAsync(async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(new AppError("You are not authorize for this action", 401));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body);

    if (!product) return next(new AppError("Product not found", 404));

    res.status(200).json(product);
  }),

  // @desc    Delete a product
  // @route   Delete /api/products
  // @access  Private(Admin)
  deleteProduct: catchAsync(async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(new AppError("You are not authorize for this action", 401));
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return next(new AppError("Product not found", 404));

    res.status(200).json(product);
  }),
};

export default productController;
