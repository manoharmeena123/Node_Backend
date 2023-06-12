const Vehicle = require("../models/vehicle");
const { createResponse } = require("../utils/response");

const getVehicles = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.userId) {
            queryObj = { userId: req.query.userId };
        }
        const vehicles = await Vehicle.find(queryObj).populate("userId");
        return createResponse(
            res,
            200,
            "Vehicles retrieved successfully",
            vehicles
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Internal server error");
    }
};

const createVehicle = async (req, res) => {
    try {
        const user = await Vehicle.findOne({ userId: req.user._id });
        if (user) {
            return createResponse(res, 400, "Vehicle already exists");
        }

        req.body.userId = req.user._id;
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        return createResponse(
            res,
            201,
            "Vehicle created successfully",
            vehicle
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Internal server error");
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate("userId");
        return createResponse(
            res,
            200,
            "Vehicle updated successfully",
            vehicle
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Internal server error");
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.findByIdAndDelete(id);
        return createResponse(res, 200, "Vehicle deleted successfully");
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Internal server error");
    }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
