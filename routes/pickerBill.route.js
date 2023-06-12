const express = require("express");
const router = express.Router();
const {
    updateBillingPicker,
    getAllBillOfPicker,
    assignBillToVerifier,
} = require("../controllers/pickerBillController");
const { authJwt } = require("../middleware");
// Get all picker bills
router.get("/picker-bills", getAllBillOfPicker);
router.put("/assign-bill/verifier/:id", assignBillToVerifier);
// Create a new picker bill
// router.post("/picker-bills", [authJwt.isAdmin], createPickerBill);
// router.put("/picker-bills/assign-bill/:id", assignBillToVerifier);
// Update a picker bill
router.put("/picker-bills/:id", updateBillingPicker);
// router.get("/picker-bills/:id", getPickerBill);
// // Delete a picker bill
// router.delete("/picker-bills/:id", deletePickerBill);

module.exports = router;
