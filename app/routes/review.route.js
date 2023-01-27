const express = require("express");
const reviews = require("../controllers/review.controller");

const router = express.Router();

router.route("/")
    .get(reviews.findAll)
    .post(reviews.create)
    .delete(reviews.deleteAll)

router.route("/:id")
    .get(reviews.findOne)
    .put(reviews.update)
    .delete(reviews.delete)

module.exports = router;
