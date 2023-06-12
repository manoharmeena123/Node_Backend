const express = require("express");
const router = express.Router();
const {
    createWholesalerOffer,
    getAllWholesalerOffers,
    getWholesalerOfferById,
    updateWholesalerOfferById,
    deleteWholesalerOfferById,
} = require("../controllers/wholeSeller");
const upload = require("../services/uploadImages");

// Create a new wholesaler offers
router.post(
    "/wholesaler-offers",
    upload.single("image"),
    createWholesalerOffer
);

// Get all wholesaler offers
router.get("/wholesaler-offers", getAllWholesalerOffers);

// Get a specific wholesaler offer by ID
router.get("/wholesaler-offers/:id", getWholesalerOfferById);

// Update a specific wholesaler offer by ID
router.put("/wholesaler-offers/:id", updateWholesalerOfferById);

// Delete a specific wholesaler offer by ID
router.delete("/wholesaler-offers/:id", deleteWholesalerOfferById);

module.exports = router;
