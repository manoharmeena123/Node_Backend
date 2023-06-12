const User = require("../models/user");
const { createResponse } = require("../utils/response");

exports.updateUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if a user with the given userId exists in the database
        const user = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
        });

        if (!user) {
            return createResponse(res, 404, "User not found");
        }

        // Update the user document with the given information

        // Send a response indicating that the user was successfully updated
        return createResponse(res, 200, "User updated successfully", user);
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};
//get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        createResponse(res, 200, "users fetched successfully", users);
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Internal server error");
    }
};
// Define a get function that retrieves a user document from the database
exports.getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if a user with the given userId exists in the database
        const user = await User.findById(userId).lean();

        if (!user) {
            return createResponse(res, 404, "User not found");
        }

        // Send a response with the user information
        return createResponse(res, 200, "User retrieved successfully", user);
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};

// Define a delete function that deletes a user document from the database
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if a user with the given userId exists in the database
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return createResponse(res, 404, "User not found");
        }

        // Delete the user document from the database

        // Send a response indicating that the user was successfully deleted
        return createResponse(res, 200, "User deleted successfully");
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};
