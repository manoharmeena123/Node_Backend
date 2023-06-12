const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Define routes for the user APIs
router.get("/users", userController.getAllUsers);
router.put("/users/:userId", userController.updateUser);
router.get("/users/:userId", userController.getUser);
router.delete("/users/:userId", userController.deleteUser);

module.exports = router;
