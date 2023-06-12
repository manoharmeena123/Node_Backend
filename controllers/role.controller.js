const { createResponse } = require("../utils/response");
// CREATE
const Role = require("../models/role.model");

// Get all roles
exports.getAllRoles = async (req, res, next) => {
    try {
        let queryObj = {};
        if (req.query.role) {
            queryObj.role = new RegExp(req.query.role, "i");
        }
        const roles = await Role.find(queryObj);
        if (roles.length === 0) {
            return res
                .status(404)
                .json({ status: 0, message: "Role not found" });
        }

        res.status(200).json({ status: 1, success: true, data: roles });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Create a new role
exports.createRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const newRole = await Role.create({ role });
        res.status(201).json({ status: 1, success: true, data: newRole });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res
                .status(404)
                .json({ status: 0, success: false, message: "Role not found" });
        }
        res.status(200).json({ status: 1, success: true, data: role });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Update a role by ID
exports.updateRoleById = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!role) {
            return res
                .status(404)
                .json({ status: 0, success: false, message: "Role not found" });
        }
        res.status(200).json({ status: 1, success: true, data: role });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};

// Delete a role by ID
exports.deleteRoleById = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res
                .status(404)
                .json({ status: 0, success: false, message: "Role not found" });
        }
        res.status(200).json({ status: 1, success: true, message: "deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            success: false,
            message: error.message,
        });
    }
};
