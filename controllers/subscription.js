const Subscription = require("../models/subscription");
const { createResponse } = require("../utils/response");
// Create a new subscription
const createSubscription = async (req, res) => {
    try {
        const { productId, userId, endDate } = req.body;
        if (!productId || !userId || !endDate) {
            return createResponse(res, 400, "please fill all ", null);
        }
        const subscription = new Subscription({
            productId,
            userId,
            endDate,
        });
        const newSubscription = await subscription.save();
        return createResponse(
            res,
            201,
            "Subscription created successfully",
            newSubscription
        );
    } catch (err) {
        return createResponse(res, 500, "Failed to create subscription", null);
    }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
    try {
        let query = { ...req.query };
        const subscriptions = await Subscription.find(query).populate(
            "productId userId"
        );
        return createResponse(
            res,
            200,
            "Subscriptions retrieved successfully",
            subscriptions
        );
    } catch (err) {
        return createResponse(
            res,
            500,
            "Failed to retrieve subscriptions",
            null
        );
    }
};

// Update a subscription's status
const updateSubscriptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const subscription = await Subscription.findById(
            req.params.subscriptionId
        );
        subscription.status = status;
        const updatedSubscription = await subscription.save();
        return createResponse(
            res,
            200,
            "Subscription status updated successfully",
            updatedSubscription
        );
    } catch (err) {
        return createResponse(
            res,
            500,
            "Failed to update subscription status",
            null
        );
    }
};

module.exports = {
    createSubscription,
    getSubscriptions,
    updateSubscriptionStatus,
};
