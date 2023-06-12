const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
// Import controllers
const {
    getOrderById,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrderSummary,
    getOrders,
    deleteOrder,
} = require("../controllers/order.controller");

// Routes for handling orders
router.get("/orders/:id", getOrderById);
router.get("/orders-summary", getOrderSummary);
router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrderToPaid);
router.put("/orders/:id/deliver", updateOrderToDelivered);
router.delete("/orders/", deleteOrder);
module.exports = router;
