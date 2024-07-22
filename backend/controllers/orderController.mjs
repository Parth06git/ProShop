import Order from "../models/OrderModel.js";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";

const orderController = {
  // @desc    Create a order
  // @route   POST /api/orders
  // @access  Private
  addOrderItems: catchAsync(async (req, res, next) => {
    let {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
      return next(new AppError("No Order items", 400));
    } else {
      const order = new Order({
        orderItems: orderItems.map((x) => ({ ...x, product: x._id, _id: undefined })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  }),

  // @desc    Get orders for a user
  // @route   GET /api/orders/myorders
  // @access  Private
  getMyOrders: catchAsync(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  }),

  // @desc    Get orders for a user by id
  // @route   GET /api/orders/:id
  // @access  Private
  getOrderById: catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return next(new AppError("No Order Found", 404));

    res.status(200).json(order);
  }),

  // @desc    Update order to paid
  // @route   PATCH /api/orders/:id/pay
  // @access  Private
  updateOrderToPaid: catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("No Order Found", 404));

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  }),

  // @desc    Update order to delivered
  // @route   PATCH /api/orders/:id/deliver
  // @access  Private/Admin
  updateOrderToDelivered: catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("No Order Found", 404));

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  }),

  // @desc    Get all orders
  // @route   GET /api/orders
  // @access  Private/Admin
  getAllOrders: catchAsync(async (req, res) => {
    const orders = await Order.find().populate("user", "_id name");
    res.status(200).json(orders);
  }),
};

export default orderController;
