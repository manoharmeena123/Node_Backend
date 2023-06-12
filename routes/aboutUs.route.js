const router = require("express").Router();
const {
    create,
    getAboutUs,
    updateAboutUs,
    deleteAboutUs,
} = require("../controllers/aboutUs");

router.post("/", create);
router.get("/", getAboutUs);
router.put("/:id", updateAboutUs);
router.delete("/:id", deleteAboutUs);
module.exports = router;
