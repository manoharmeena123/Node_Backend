const express = require("express");
const router = express.Router();
const userController = require("../controllers/admin.controller");
const { authJwt, validate } = require("../middleware");

// Define routes for the user APIs
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/", userController.getAdmins);
router.put("/:id", [validate.updateUser], userController.updateAdmins);
router.get("/:id", userController.getAdmin);
router.delete("/:id", userController.deleteAdmins);

module.exports = router;
