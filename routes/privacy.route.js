const express = require("express");
const router = express.Router();
const termsController = require("../controllers/privacy.controller");
const { authJwt, objectId } = require("../middlewares");

// GET all terms and conditions
router.post("/admin/privacy", termsController.getAllTerms);

// GET a single term and condition by ID
router.get(
    "/admin/privacy/:id",
    [objectId.validId],
    termsController.getTermById
);

// CREATE a new term and condition
router.post("/admin/createPrivacy", [authJwt.isAdmin], termsController.createTerm);

// UPDATE a term and condition by ID
router.put(
    "/admin/privacy/:id",
    [authJwt.isAdmin, objectId.validId],
    termsController.updateTerm
);

// DELETE a term and condition by ID
router.delete(
    "/admin/privacy/:id",
    [authJwt.isAdmin, objectId.validId],
    termsController.deleteTerm
);

// users
router.get("/privacy", termsController.getAllTerms);

// GET a single term and condition by ID
router.get("/privacy/:id", termsController.getTermById);

module.exports = router;
