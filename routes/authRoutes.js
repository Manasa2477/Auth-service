const express = require("express");
const { APIS } = require("../config/constants");
const authcontroller = require("../controller/authController")
const router = express.Router();
router.use(APIS.AUTH.ENDPOINT.LOGIN,authcontroller.login)
router.use(APIS.AUTH.ENDPOINT.CREATE_PIN,authcontroller.createpin)
router.use(APIS.AUTH.ENDPOINT.VERIFY_PIN,authcontroller.verifypin)
router.use(APIS.AUTH.ENDPOINT.RESET_PIN,authcontroller.resetpin)
module.exports = router