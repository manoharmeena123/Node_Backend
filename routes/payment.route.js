const router = require("express").Router();
const { authJwt } = require("../middleware");
// Import controllers
const payment = require("../controllers/payment.controller");
// Routes for handling orders
router.get("/:id", payment.getPayment);
router.post("/:id", [authJwt.verifyToken], payment.createPaymentOrder);
router.put("/:id", payment.updatePayment);
// router.delete("/:id", payment.deletePayment);

router.get("/", payment.getPayments);
module.exports = router;
