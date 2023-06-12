const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");

// Get all addresses for a user
router.get("/addresses/:userId", addressController.getAddresses);

// Get a single address by ID
// router.get("/addresses/:addressId", addressController.getAddressById);

// Create a new address for a user
router.post("/addresses", addressController.createAddress);

// Update an existing address
router.put("/addresses/:addressId", addressController.updateAddress);

// Delete an address
router.delete("/addresses/:addressId", addressController.deleteAddress);

module.exports = router;
