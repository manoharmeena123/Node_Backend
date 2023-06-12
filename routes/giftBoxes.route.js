const express = require("express");
const router = express.Router();
const upload = require("../services/uploadImages");
const {
    createGiftBox,
    getGiftBoxById,
    updateGiftBox,
    deleteGiftBox,
    getGiftBoxes,
} = require("../controllers/giftBoxesController");

// Get all gift boxes
router.get("/", getGiftBoxes);

// Get gift box by id
router.get("/:id", getGiftBoxById);

// Create new gift box
router.post("/", upload.single("photos"), createGiftBox);

// Update gift box by id
router.put("/:id", updateGiftBox);

// Delete gift box by id
router.delete("/:id", deleteGiftBox);

module.exports = router;
