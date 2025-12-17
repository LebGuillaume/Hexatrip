const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

//check with authenticate later
router.get("/", orderController.getAll);
module.exports = router;
