const express = require("express");
const router = express.Router();
const reasonsController = require("../controllers/reason");

// Create a new reason
router.post("/reasons", reasonsController.createReason);

// Retrieve all reasons
router.get("/reasons", reasonsController.getReasons);

// Retrieve a single reason by ID
router.get("/reasons/:id", reasonsController.getReasonById);

// Update a reason by ID
router.put("/reasons/:id", reasonsController.updateReason);

// Delete a reason by ID
router.delete("/reasons/:id", reasonsController.deleteReason);

module.exports = router;
