const express = require('express');
const help = require('../controllers/helpandsupport');
const { authJwt } = require("../middleware");


const router = express();

router.post('/addQuery',[authJwt.verifyToken], help.AddQuery);
router.get('/getQuery', help.getAllHelpandSupport);
router.get('/user',  [authJwt.verifyToken], help.getAllHelpandSupportgetByuserId);
router.delete('/delete/:id', help.DeleteHelpandSupport);




module.exports = router;

