const express = require("express");
const router = express.Router();
const festivalController = require("../controllers/billingController");
const uploadImage = require("../services/uploadImages");
// Route for getting all festivals
router.get("/", festivalController.getFestivals);

// Route for creating a new festival
router.post(
    "/",

    festivalController.createFestival
);

// Route for getting a single festival by id
router.get("/:id", festivalController.getFestivalById);

// Route for updating a festival by id
router.put("/:id", festivalController.updateFestival);

// Route for deleting a festival by id
router.delete("/:id", festivalController.deleteFestival);

module.exports = router;
