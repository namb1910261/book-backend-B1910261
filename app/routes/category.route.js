const express = require("express");
const categorys = require("../controllers/category.controller");

const router = express.Router();

router.route("/")
    .get(categorys.findAll)
    .post(categorys.create)
    .delete(categorys.deleteAll)

router.route("/categorys_user_id/:userid")
    .get(categorys.findAllCategoryByUserId)

router.route("/:id")
    .get(categorys.findOne)
    .put(categorys.update)
    .delete(categorys.delete)

module.exports = router;
