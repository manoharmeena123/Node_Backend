const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const {
    updateBillingPicker,
    getAllBillOfPicker,
    assignBillToPacker,
} = require("../controllers/verifyBill.controller");

// // Get all verifier-bills
router.get("/verifier-bills", getAllBillOfPicker);

// // Get product by ID
// router.get("/verifier-bills/:id", getVerifierBill);

// // Create a new product
// router.post("/verifier-bills", [authJwt.isAdmin], createVerifierBill);

// // Update a product by ID
router.put("/verifier-bills/:id", updateBillingPicker);
router.put("/assign-bill/packer/:id", assignBillToPacker);

// // Delete a product by ID
// router.delete("/verifier-bills/:id", deleteVerifierBill);

// //most selling verifier-bills
// router.put("/verifier-bills/assign-bill/:id", assignBillToPacker);

module.exports = router;
