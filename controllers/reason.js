const Reason = require("../models/reason"); // Import Mongoose model

const { createResponse } = require("../utils/response"); // Import the createResponse function

// Create a new reason
exports.createReason = async (req, res) => {
    try {
        const { reason } = req.body; // Retrieve the reason data from the request body
        if (!reason) {
            // Return a 400 error response if the reason is not provided
            return createResponse(res, 400, "Reason is required");
        }
        const newReason = new Reason({ reason }); // Create a new Mongoose document using the retrieved data

        await newReason.save(); // Save the new document to the database

        // Return a success response
        return createResponse(
            res,
            201,
            "Reason created successfully",
            newReason
        );
    } catch (err) {
        // Return an error response
        return createResponse(res, 500, "Error creating reason", err);
    }
};

// Retrieve all reasons
exports.getReasons = async (req, res) => {
    try {
        const reasons = await Reason.find(); // Retrieve all reasons from the database

        // Return a success response with the retrieved data
        return createResponse(
            res,
            200,
            "Reasons retrieved successfully",
            reasons
        );
    } catch (err) {
        // Return an error response
        return createResponse(res, 500, "Error retrieving reasons", err);
    }
};

// Retrieve a single reason by ID
exports.getReasonById = async (req, res) => {
    try {
        const reason = await Reason.findById(req.params.id); // Retrieve the reason with the specified ID from the database

        if (!reason) {
            // Return a 404 error response if the reason is not found
            return createResponse(res, 404, "Reason not found");
        }

        // Return a success response with the retrieved data
        return createResponse(
            res,
            200,
            "Reason retrieved successfully",
            reason
        );
    } catch (err) {
        // Return an error response
        return createResponse(res, 500, "Error retrieving reason", err);
    }
};

// Update a reason by ID
exports.updateReason = async (req, res) => {
    try {
        // Retrieve the updated reason data from the request body

        const updatedReason = await Reason.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ); // Find and update the reason with the specified ID in the database

        if (!updatedReason) {
            // Return a 404 error response if the reason is not found
            return createResponse(res, 404, "Reason not found");
        }

        // Return a success response with the updated data
        return createResponse(
            res,
            200,
            "Reason updated successfully",
            updatedReason
        );
    } catch (err) {
        // Return an error response
        return createResponse(res, 500, "Error updating reason", err);
    }
};

// Delete a reason by ID
exports.deleteReason = async (req, res) => {
    try {
        const deletedReason = await Reason.findByIdAndDelete(req.params.id); // Find and delete the reason with the specified ID from the database

        if (!deletedReason) {
            // Return a 404 error response if the reason is not found
            return createResponse(res, 404, "Reason not found");
        }

        // Return a success response with the deleted data
        return createResponse(
            res,
            200,
            "Reason deleted successfully",
            deletedReason
        );
    } catch (err) {
        // Return an error response
        return createResponse(res, 500, "Error deleting reason", err);
    }
};
