const Banner = require("../models/banner");
const { createResponse } = require("../utils/response");

// Create a new banner
const createBanner = async (req, res) => {
    try {
        req.body.image = { url: req.file.location, key: req.file.key };
        const banner = await Banner.create(req.body);
        createResponse(res, 201, "Banner created successfully", banner);
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};

// Get all banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().lean();
        createResponse(res, 200, "Banners retrieved successfully", banners);
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};

// Get a single banner by ID
const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            createResponse(res, 404, "Banner not found");
        } else {
            createResponse(res, 200, "Banner retrieved successfully", banner);
        }
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};

// Update a banner by ID
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!banner) {
            createResponse(res, 404, "Banner not found");
        } else {
            createResponse(res, 200, "Banner updated successfully", banner);
        }
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};
const deleteImageFromAws = require("../services/deleteImage");
// Delete a banner by ID
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            createResponse(res, 404, "Banner not found");
        } else {
            deleteImageFromAws(banner.image.key);
            createResponse(res, 200, "Banner deleted successfully");
        }
    } catch (err) {
        console.error(err);
        createResponse(res, 500, "Server error");
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
