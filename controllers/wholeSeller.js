const WholesalerOffer = require("../models/wholeSeller");
const { createResponse } = require("../utils/response");

// Create a new wholesaler offer
const deleteImageFromAws = require("../services/deleteImage");
exports.createWholesalerOffer = async (req, res) => {
    try {
        const {
            name,
            description,

            startDate,
            endDate,
            discountPercent,
        } = req.body;
        if (!startDate || !endDate || !discountPercent) {
            return createResponse(res, 400, "Please fill all the fields");
        }
        req.body.image = { url: req.file.location, key: req.file.key };
        const newOffer = new WholesalerOffer(req.body);
        const createdOffer = await newOffer.save();
        createResponse(res, 201, "Wholesaler offer created", createdOffer);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

// Get all wholesaler offers
exports.getAllWholesalerOffers = async (req, res) => {
    try {
        const offers = await WholesalerOffer.find().lean();
        createResponse(res, 200, "Wholesaler offers fetched", offers);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

// Get a single wholesaler offer by ID
exports.getWholesalerOfferById = async (req, res) => {
    try {
        const offer = await WholesalerOffer.findById(req.params.id);
        if (!offer) {
            return createResponse(res, 404, "Wholesaler offer not found");
        }
        createResponse(res, 200, "Wholesaler offer fetched", offer);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

// Update a single wholesaler offer by ID
exports.updateWholesalerOfferById = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            startDate,
            endDate,
            discountPercent,
            isActive,
        } = req.body;
        const offer = await WholesalerOffer.findById(req.params.id);
        if (!offer) {
            return createResponse(res, 404, "Wholesaler offer not found");
        }
        offer.name = name || offer.name;
        offer.description = description || offer.description;
        offer.image = image || offer.image;
        offer.startDate = startDate || offer.startDate;
        offer.endDate = endDate || offer.endDate;
        offer.isActive = isActive || offer.isActive;
        offer.discountPercent = discountPercent || offer.discountPercent;
        const updatedOffer = await offer.save();
        createResponse(res, 200, "Wholesaler offer updated", updatedOffer);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

// Delete a single wholesaler offer by ID
exports.deleteWholesalerOfferById = async (req, res) => {
    try {
        const offer = await WholesalerOffer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return createResponse(res, 404, "Wholesaler offer not found");
        }
        deleteImageFromAws(offer.image.key);
        createResponse(res, 200, "Wholesaler offer deleted");
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};
