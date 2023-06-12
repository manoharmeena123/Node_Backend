const doc = require("../controllers/role.controller");
const { authJwt } = require("../middleware");
const router = require("express").Router();

router.post("/roles", doc.createRole);
router.get("/roles", doc.getAllRoles);
router.get("/roles/:id", doc.getRoleById);
router.put(
    "/roles/:id",

    doc.updateRoleById
);
router.delete(
    "/roles/:id",

    doc.deleteRoleById
);

module.exports = router;
