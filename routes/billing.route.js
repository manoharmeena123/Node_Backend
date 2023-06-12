const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { validate } = require("../middleware");
// GET /api/billings
router.get("/", billingController.getAllBillings);

// POST /api/billings
router.post("/", [validate.billing], billingController.createBilling);

// GET /api/billings/:id
router.get("/:id", billingController.getBillingById);

// PUT /api/billings/:id
router.put("/:id", billingController.updateBilling);
router.put("/assign-bill/:id", billingController.assignBillToPicker);
// DELETE /api/billings/:id
router.delete("/:id", billingController.deleteBilling);

module.exports = router;
