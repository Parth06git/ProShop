import Product from "../models/ProductModel.js";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";

const productController = {
  // @desc    Fetch all products
  // @route   GET /api/products
  // @access  Public
  getAllProducts: catchAsync(async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Product.countDocuments();

    const products = await Product.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

  // @desc    Create new review
  // @route   POST /api/products/:id/reviews
  // @access  Private
  createProductReview: catchAsync(async (req, res, next) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError("Product not found", 404));

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  }),
};

export default productController;
