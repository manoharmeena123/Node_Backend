const AboutUs = require("../models/aboutUs");
const { createResponse } = require("../utils/response");

// Get the about us information
const create = async (req, res) => {
    try {
        const aboutUs = await AboutUs.create(req.body);
        return createResponse(
            res,
            201,
            "About us created successfully",
            aboutUs
        );
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Server error");
    }
};
const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.find().lean();
        if (!aboutUs) {
            return createResponse(res, 404, "About us not found");
        }
        return createResponse(
            res,
            200,
            "About us retrieved successfully",
            aboutUs[aboutUs.length - 1]
        );
    } catch (error) {
        console.error;
        return createResponse(res, 500, "Internal server error");
    }
};

// Update the about us information
const updateAboutUs = async (req, res) => {
    const { imageUrl, title, content } = req.body;
    try {
        const aboutUs = await AboutUs.findOne();
        if (!aboutUs) {
            return createResponse(res, 404, "About us not found");
        }
        aboutUs.title = title || aboutUs.title;
        aboutUs.content = content || aboutUs.content;
        if (imageUrl && imageUrl !== aboutUs.imageUrl) {
            aboutUs.imageUrl = imageUrl || aboutUs.imageUrl;
        }
        const updatedAboutUs = await aboutUs.save();
        return createResponse(
            res,
            200,
            "About us updated successfully",
            updatedAboutUs
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Internal server error");
    }
};
const deleteAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
        if (!aboutUs) {
            createResponse(res, 404, "About us not found");
        } else {
            createResponse(res, 200, "About us deleted successfully");
        }
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};

module.exports = { create, getAboutUs, updateAboutUs, deleteAboutUs };
