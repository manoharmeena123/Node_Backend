const express = require("express");
const router = express.Router();

// Define routes for the user APIs
router.use("/admin", require("../routes/admin.route"));
router.use("/auth", require("../routes/auth.route"));
router.use("/", require("../routes/user.route"));
router.use("/", require("../routes/verifierBill.route"));
router.use("/", require("../routes/role.route"));
router.use("/bills", require("../routes/billing.route"));
router.use("/", require("../routes/billItem.route"));
router.use("/", require("../routes/pickerBill.route"));
router.use("/", require("../routes/packer.route"));
router.use("/help/", require("../routes/helpandsupport"));

router.use("/", require("../routes/dispatch.route"));
router.use("/", require("../routes/reason.route"));

router.use("/", require("../routes/order.route"));
router.use("/terms", require("../routes/terms.route"));
router.use("/notifications", require("../routes/notification.route"));
router.use("/aboutUs", require("../routes/aboutUs.route"));
router.use("/faqs", require("../routes/faq.route"));
// router.use("/", require("../routes/wholeSeller.route"));
// router.use("/festival-offers", require("../routes/festival.route"));
// router.use("/gift-boxes", require("../routes/giftBoxes.route"));
router.use("/feedback", require("../routes/feedback.route"));
router.use("/", require("../routes/vehicle.route"));

module.exports = router;
