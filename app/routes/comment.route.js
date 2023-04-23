const express = require("express");
const comments = require("../controllers/comment.controller");

const router = express.Router();

router.route("/")
    .get(comments.findAll)
    .post(comments.create)
    .delete(comments.deleteAll)

router.route("/comments_user_id/:userid")
    .get(comments.findAllCommentByUserId)
router.route("/comments_review_id/:reviewid")
    .get(comments.findAllCommentByReviewId)
router.route("/comments_user_id_review_id/:userid-:reviewid")
    .get(comments.findAllCommentByUserIdAndReviewId)
router.route("/comments_user_id/delete/:userid")
    .delete(comments.deleteByUserId)

router.route("/:id")
    .get(comments.findOne)
    .put(comments.update)
    .delete(comments.delete)

module.exports = router;
