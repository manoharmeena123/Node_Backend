const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner");
const upload = require("../services/uploadImages");
// Route to create a new banner
router.post("/", [upload.single("photos")], bannerController.createBanner);

// Route to get all banners
router.get("/", bannerController.getAllBanners);

// Route to get a specific banner by ID
router.get("/:id", bannerController.getBannerById);

// Route to update a specific banner by ID
router.put("/:id", bannerController.updateBanner);

// Route to delete a specific banner by ID
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
