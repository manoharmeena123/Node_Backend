const Feedback = require("../models/feedback");
const { createResponse } = require("../utils/response");
const User = require("../models/user");

// Create a new feedback
const createFeedback = async (req, res) => {
    try {
        const { rating, message, user } = req.body;
        const user1 = await User.findById(user);
        if (!rating || !user) {
            return createResponse(res, 400, "Rating and user ID are required");
        }
        if (rating < 1 || rating > 5) {
            return createResponse(res, 400, "Rating must be between 1 and 5");
        }
        const feedback = new Feedback({
            user,
            name: user1.name,
            email: user1.email,
            rating,
            message,
        });
        const savedFeedback = await feedback.save();
        createResponse(res, 201, "Feedback created", savedFeedback);
    } catch (err) {
        createResponse(res, 500, "Error creating feedback", err.message);
    }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({});
        createResponse(res, 200, "All feedback retrieved", feedback);
    } catch (err) {
        createResponse(res, 500, "Error retrieving feedback", err.message);
    }
};

// Update feedback by ID
const updateFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            req.body,
            {
                new: true,
            }
        );
        if (!feedback) {
            return createResponse(res, 404, "Feedback not found");
        }
        return createResponse(
            res,
            200,
            "Feedback updated successfully",
            feedback
        );
    } catch (err) {
        console.error(err.message);
        return createResponse(res, 500, "Server error");
    }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return createResponse(res, 404, "Feedback not found");
        }
        return createResponse(
            res,
            200,
            "Feedback deleted successfully",
            feedback
        );
    } catch (err) {
        console.error(err.message);
        return createResponse(res, 500, "Server error");
    }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return createResponse(res, 404, "Feedback not found");
        }
        return createResponse(
            res,
            200,
            "Feedback retrieved successfully",
            feedback
        );
    } catch (err) {
        console.error(err.message);
        return createResponse(res, 500, "Server error");
    }
};
const getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ user: req.user.id });
        createResponse(res, 200, "All feedback retrieved", feedback);
    } catch (err) {
        createResponse(res, 500, "Error retrieving feedback", err.message);
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
    updateFeedback,
    deleteFeedback,
    getMyFeedback,
    getFeedbackById,
};
