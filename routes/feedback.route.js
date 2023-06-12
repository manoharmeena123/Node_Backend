const express = require("express");
const router = express.Router();
const {createFeedback,getAllFeedback,updateFeedback,deleteFeedback,getFeedbackById,getMyFeedback} = require("../controllers/feedback");
const { authJwt } = require("../middleware");

// Create a new feedback
router.post("/", createFeedback);
router.post("/my", [authJwt.verifyToken], getMyFeedback);

// Get all feedbacks
router.get("/", getAllFeedback);

// Get a single feedback by ID
router.get("/:id", getFeedbackById);

// Update a feedback by ID
router.put("/:id", updateFeedback);

// Delete a feedback by ID
router.delete("/:id", deleteFeedback);

module.exports = router;
