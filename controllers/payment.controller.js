const razorpay = require("razorpay");

const uuid = require("uuid");
const id = uuid.v4();
const payment = require("../models/payment");
const ProductOrder = require("../models/order");
const { createResponse } = require("../utils/response");
require("dotenv").config();
const Razorpay = new razorpay({
    key_id: process.env.RAZORPAY_ACCESS_KEY,
    // "rzp_live_oe2m9rifPN1OM5",
    key_secret: process.env.RAZORPAY_SECRET_KEY,
    // "lVgPoYfEbRchEnFISM6yJAdr",
});

exports.createPaymentOrder = async (req, res) => {
    try {
        const productOrder = await ProductOrder.findOne({ _id: req.params.id });
        if (!productOrder) {
            return res.status(404).json({ message: "productOrder not found" });
        }
        const data = {
            amount: parseInt(productOrder.totalPrice),
            currency: "INR",
            receipt: id,
            partial_payment: false,
        };
        console.log(data);
        const result = await Razorpay.orders.create(data);
        console.log(result);

        const DBData = {
            userId: req.user._id,
            name: req.user.name,
            payment_Id: result.id,
            amount: req.body.amount,
            amount_paid: result.amount,
            receipt: result.receipt,
            order: req.params.id,
            paymentMethod: req.body.paymentMethod,
            status: req.body.status,
        };
        console.log(DBData);
        const payment1 = await payment.create(DBData);
        if (payment1.status == "success") {
            productOrder.isPaid = true;
            await productOrder.save();
        }

        createResponse(res, 200, "payment order created", payment1);
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "Server Error");
    }
};

exports.getPayments = async (req, res) => {
    try {
        let query = {};
        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        const Data = await payment.find(query).lean();
        if (Data.length === 0) {
            return createResponse(res, 200, "payment not found");
        }
        createResponse(res, 200, "payment found", Data);
    } catch (err) {
        console.log(err);
        res.state(400).json({
            message: err.message,
        });
    }
};

exports.getPayment = async (req, res) => {
    try {
        const Data = await payment.findById(req.params.id).lean();
        if (!Data) {
            return createResponse(res, 200, "payment not found");
        }
        createResponse(res, 200, "payment found", Data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const result = await payment.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!result) {
            return createResponse(res, 200, "payment not found");
        }
        if (result.status == "success") {
            const productOrder = await ProductOrder.findOne({
                _id: result.order,
            });
            productOrder.isPaid = true;
            await productOrder.save();
        }

        createResponse(res, 200, "payment updated", result);
    } catch (err) {
        console.log(err);
        createResponse(res, 500, "Server Error");
    }
};
