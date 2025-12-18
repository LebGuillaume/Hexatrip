const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");
//front
router.get("/", tripController.getAll);
router.get("/bestseller", tripController.getAllBestsellers);
//postman

router.post("/", tripController.create);
router.get("/:id", tripController.getOne);
router.patch("/:id", tripController.patchOne);
router.delete("/:id", tripController.deleteOne);
router.delete("/", tripController.deleteAll);

module.exports = router;
