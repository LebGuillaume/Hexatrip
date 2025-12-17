const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");

//front:
router.get("/", agencyController.getAll);
//postman:
router.post("/", agencyController.create);
router.get("/:id", agencyController.getOne);
module.exports = router;
