const Order = require("../models/order");
const { createResponse } = require("../utils/response");
const Notification = require("../models/notification");
const Bill = require("../models/billing");
const Admin = require("../models/admin");
const mongoose = require("mongoose");
const { query } = require("express");
const ObjectId = mongoose.Types.ObjectId;
const getOrders = async (req, res) => {
    try {
        const query = {};
        if (req.query.userId) {
            query.userId = new ObjectId(req.query.userId);
        }

        const pipeline = [
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            {
                $lookup: {
                    from: "billings",
                    localField: "bill",
                    foreignField: "_id",
                    as: "bill",
                },
            },
            {
                $unwind: "$bill",
            },
            {
                $lookup: {
                    from: "billitems",
                    localField: "bill.billItems",
                    foreignField: "_id",
                    as: "billItems",
                },
            },
        ];

        const result = await Order.aggregate(pipeline);

        return createResponse(res, 200, "Orders found", result[0]);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

const getOrderSummary = async (req, res) => {
    try {
        const { startDate, endDate, userId, uid } = req.query;
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (userId) {
            query.userId = new ObjectId(userId);
        }
        if (uid) {
            query.uid = uid;
        }
        console.log(query);
        const pipeline = [
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            {
                $lookup: {
                    from: "billings",
                    localField: "bill",
                    foreignField: "_id",
                    as: "bill",
                },
            },
            {
                $unwind: "$bill",
            },
            {
                $lookup: {
                    from: "billitems",
                    localField: "billItems",
                    foreignField: "_id",
                    as: "billItems",
                },
            },

            {
                $group: {
                    _id: null,
                    totalReceive: { $sum: { $toDouble: "$receive" } },
                    totalReturn: { $sum: { $toDouble: "$return" } },
                    totalShortage: { $sum: { $toDouble: "$shortage" } },
                    totalBalance: { $sum: { $toDouble: "$balance" } },
                    orders: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalReceive: 1,
                    totalReturn: 1,
                    totalShortage: 1,
                    totalBalance: 1,
                    orders: 1,
                },
            },
        ];

        const result = await Order.aggregate(pipeline);

        return createResponse(res, 200, "Orders found", result[0]);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate(["userId"])
            .populate({ path: "bill", populate: { path: "billItems" } });
        if (!order) {
            return createResponse(res, 404, "Order not found");
        }

        return createResponse(res, 200, "Order found", order);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

const createOrder = async (req, res) => {
    try {
        if (req.body.bill.length == 1) {
            const uid = await Order.find().sort({ createdAt: -1 }).limit(1);
            if (!uid || uid.length == 0) {
                req.body.uid = 1;
            } else {
                req.body.uid = uid[0].uid + 1;
            }
            const order = new Order(req.body);

            const createdOrder = await order.save();
            const bill = await Bill.findById(req.body.bill);
            bill.deliveryOrder = createdOrder._id;
            bill.dispatch.status = "dispatched";
            bill.dispatch.assigned = true;
            await bill.save();
            // msg to customer for delivery
            await Notification.create({
                userId: req.body.userId,
                title: "New Order Assigned",
                message: "You have been assigned 1 new order.",
            });
            return createResponse(
                res,
                201,
                "Order created successfully",
                createdOrder
            );
        } else {
            const orders = [];
            for (let i = 0; i < req.body.bill; i++) {
                orders.push({
                    userId: req.body.userId,
                    uid: req.body.uid + 1,
                    bill: req.body.bill[i],
                });
            }
            const createdOrders = await Order.insertMany(orders);
            createdOrders.forEach(async (order) => {
                const bill = await Bill.findById(order.bill);
                bill.deliveryOrder = order._id;
                bill.dispatch.assigned = true;
                await bill.save();
            });

            await Notification.create({
                userId: req.body.userId,
                title: "New Order Assigned",
                message: `You have been assigned ${createdOrders.length} new orders.`,
            });
            return createResponse(
                res,
                201,
                "Orders created successfully",
                createdOrders
            );
        }
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return createResponse(res, 404, "Order not found");
        }

        if (req.body.isDelivered === true) {
            req.body.isDelivered = true;
            req.body.deliveredAt = Date.now();
        }

        const orders = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        console.log(orders);
        if (req.body.paymentMode) {
            const bill = await Bill.findById(order.bill);
            bill.paymentMode = req.body.paymentMode;
            await bill.save();
        }
        if (orders.isDelivered === true) {
            const admins = await Admin.find({ role: "Admin" });
            let notificationObj = [];
            admins.forEach(async (admin) => {
                notificationObj.push({
                    userId: admin._id,
                    title: "Order Delivered",
                    message: `Order uid ${order.uid} has been delivered.`,
                });
            });
            await Notification.insertMany(notificationObj);
            // msg to customer for delivery on mobile
        }

        // await Notification.create({userId:

        if (!orders) {
            return createResponse(res, 404, "Order not found");
        }

        return createResponse(res, 200, "Order updated", orders);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return createResponse(res, 404, "Order not found");
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        return createResponse(res, 200, "Order updated", updatedOrder);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.deleteMany();
        if (!order) {
            return createResponse(res, 404, "Order not found");
        }
        createResponse(res, 200, "Order deleted successfully", order);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server Error");
    }
};

module.exports = {
    getOrderById,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getOrderSummary,
    deleteOrder,
};
