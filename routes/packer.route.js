const express = require("express");
const router = express.Router();
const {
    updateBillingPacker,
    getAllBillOfPacker,
    assignBillToDispatch,
} = require("../controllers/packercontroller");
const { authJwt } = require("../middleware");
// Get all packer bills
router.get("/packer-bills", getAllBillOfPacker);
router.put("/assign-bill/dispatch/:id", assignBillToDispatch);
// Create a new packer bill
// router.post("/packer-bills", [authJwt.isAdmin], createPackerBill);
// router.put("/packer-bills/assign-bill/:id", assignBillToVerifier);
// Update a packer bill
router.put("/packer-bills/:id", updateBillingPacker);
// router.get("/packer-bills/:id", getPackerBill);
// // Delete a packer bill
// router.delete("/packer-bills/:id", deletePackerBill);

module.exports = router;
