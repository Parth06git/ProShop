import express from "express";
import orderController from "../controllers/orderController.mjs";
import userController from "../controllers/userController.mjs";

const router = express.Router();

router.use(userController.protect);
router.route("/").get(orderController.getAllOrders).post(orderController.addOrderItems);
router.route("/:id").get(orderController.getOrderById);
router.route("/myorders").get(orderController.getMyOrders);
router.route("/:id/pay").patch(orderController.updateOrderToPaid);
router.route("/:id/deliver").patch(orderController.updateOrderToDelivered);

export default router;
