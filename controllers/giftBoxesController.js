const GiftBox = require("../models/giftBoxes");
const Product = require("../models/Product");
const deleteImageFromS3 = require("../services/deleteImage");
const { createResponse } = require("../utils/response");

// API to create a new gift box
const createGiftBox = async (req, res) => {
    try {
        const { name, description, price, products } = req.body;
        console.log(products);
        // console.log(req.body);
        // Check if all products exist in the database
        // const productIds = products.map((p) => p.productId);
        const allProductsExist = await Product.find({
            _id: { $in: products },
        });
        // console.log(allProductsExist);
        if (allProductsExist.length !== products.length) {
            return createResponse(res, 400, "Invalid product ID(s)");
        }

        const giftBox = new GiftBox({
            name,
            description,
            image: { url: req.file.location, key: req.file.key },
            price,
            products,
        });
        await giftBox.save();
        console.log(giftBox);
        return createResponse(
            res,
            201,
            "Gift box created successfully",
            giftBox
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server error");
    }
};

// API to get all gift boxes
const getGiftBoxes = async (req, res) => {
    try {
        const giftBoxes = await GiftBox.find().populate("products.productId");
        return createResponse(
            res,
            200,
            "Gift boxes retrieved successfully",
            giftBoxes
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server error");
    }
};

// API to get a single gift box by ID
const getGiftBoxById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if gift box exists in the database
        const giftBox = await GiftBox.findById(id).populate(
            "products.productId",
            "name image price"
        );
        if (!giftBox) {
            return createResponse(res, 404, "Gift box not found");
        }

        return createResponse(
            res,
            200,
            "Gift box retrieved successfully",
            giftBox
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server error");
    }
};

// API to update a gift box by ID
const updateGiftBox = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, price, products } = req.body;

        // Check if all products exist in the database

        // Check if gift box exists in the database
        let giftBox = await GiftBox.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!giftBox) {
            return createResponse(res, 404, "Gift box not found");
        }

        return createResponse(
            res,
            200,
            "Gift box updated successfully",
            giftBox
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server error");
    }
};

// API to delete a gift box by ID
const deleteGiftBox = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if gift box exists
        const giftBox = await GiftBox.findByIdAndDelete(id);
        if (!giftBox) {
            return createResponse(res, 404, "Gift box not found");
        }
        deleteImageFromS3(giftBox.image.key);
        return createResponse(res, 200, "Gift box deleted successfully");
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Server error");
    }
};
module.exports = {
    createGiftBox,
    getGiftBoxes,
    getGiftBoxById,
    updateGiftBox,
    deleteGiftBox,
};
