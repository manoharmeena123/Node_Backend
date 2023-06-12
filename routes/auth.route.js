const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");

// Define routes for the user APIs
router.post("/signup", userController.signup);
// router.post("/login-with-email", userController.login);
router.post("/login", userController.login);
router.post("/verify-otp/:id", userController.verifyOtp);
module.exports = router;
