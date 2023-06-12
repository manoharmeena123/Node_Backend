const Address = require("../models/address.model");
const { createResponse } = require("../utils/response");

// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const { address, userId, city, state, pinCode, landMark, street } =
            req.body;

        const newAddress = new Address({
            address,
            city,
            state,
            pinCode,
            landMark,
            street,
            userId,
        });

        await newAddress.save();
        return createResponse(
            res,
            201,
            "Address created successfully",
            newAddress
        );
    } catch (error) {
        console.error(error);
        return createResponse(
            res,
            500,
            "Error creating address",
            error.message
        );
    }
};

// Get all addresses of a user
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.params.id;

        const addresses = await Address.findOne({ user: userId });
        return createResponse(
            res,
            200,
            "Addresses retrieved successfully",
            addresses
        );
    } catch (error) {
        console.error(error);
        return createResponse(
            res,
            500,
            "Error retrieving addresses",
            error.message
        );
    }
};
exports.getAddressesById = async (req, res) => {
    try {
        const addresses = await Address.findOne({ _id: req.params.id });
        return createResponse(
            res,
            200,
            "Addresses retrieved successfully",
            addresses
        );
    } catch (error) {
        console.error(error);
        return createResponse(
            res,
            500,
            "Error retrieving addresses",
            error.message
        );
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const { address, city, state, pinCode, landMark, street } = req.body;
        const addressId = req.params.id;

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            req.body,
            { new: true }
        );

        return createResponse(
            res,
            200,
            "Address updated successfully",
            updatedAddress
        );
    } catch (error) {
        console.error(error);
        return createResponse(
            res,
            500,
            "Error updating address",
            error.message
        );
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        await Address.findByIdAndDelete(addressId);

        return createResponse(res, 200, "Address deleted successfully");
    } catch (error) {
        console.error(error);
        return createResponse(
            res,
            500,
            "Error deleting address",
            error.message
        );
    }
};
