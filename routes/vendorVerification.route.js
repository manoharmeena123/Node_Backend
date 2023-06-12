const router = require("express").Router();
const verificationController = require("../controllers/vendorVerification");
router.post("/", verificationController.createVendorVerification);
router.get("/", verificationController.getAllVendorVerifications);
router.get("/:id", verificationController.getVendorVerificationById);
router.put("/:id", verificationController.updateVendorVerification);
router.delete("/:id", verificationController.deleteVendorVerification);
module.exports = router;
