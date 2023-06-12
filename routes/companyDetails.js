const express = require("express");
const router = express.Router();
const companyDetailsController = require("../controllers/companyDetails");

// GET all company details
router.get("/", companyDetailsController.getAllCompanyDetails);

// GET company details by ID
router.get("/:id", companyDetailsController.getCompanyDetailsById);

// CREATE new company details
router.post("/", companyDetailsController.createCompanyDetails);

// UPDATE company details by ID
router.put("/:id", companyDetailsController.updateCompanyDetailsById);

// DELETE company details by ID
router.delete("/:id", companyDetailsController.deleteCompanyDetailsById);

module.exports = router;
