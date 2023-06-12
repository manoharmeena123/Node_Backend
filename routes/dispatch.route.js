const express = require("express");
const router = express.Router();
const {
    updateBillingDispatch,
    getAllBillOfDispatch,
    assignBillToDispatch,
} = require("../controllers/dispatch.controller");
const { authJwt } = require("../middleware");

router.get("/dispatch-bills", getAllBillOfDispatch);
router.put("/assign-bill/dispatch/:id", assignBillToDispatch);
router.put("/dispatch-bills/:id", updateBillingDispatch);

module.exports = router;
