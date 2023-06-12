const express = require("express");
const router = express.Router();
const {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require("../controllers/vehicle");
const { authJwt } = require("../middleware");
router.get("/vehicles", getVehicles);
router.post("/vehicles", [authJwt.verifyToken], createVehicle);
router.put("/vehicles/:id", updateVehicle);
router.delete("/vehicles/:id", deleteVehicle);

module.exports = router;
