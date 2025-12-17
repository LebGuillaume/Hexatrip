const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");
//front
router.get("/", tripController.getAll);
//postman

router.post("/", tripController.create);
module.exports = router;
