const ApiError = require("../api-error");
const CommentService = require("../services/comment.service");
const MongoDB = require("../utils/mongodb.util");

// Create and save new comment
exports.create = async (req, res, next) => {
    if (!req.body?.user_id) {
        return next(new ApiError(400, "Userid cannot be empty"));
    }

    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the comment")
        );
    }
};

// Retrieve all comment of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const commentService = new CommentService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await commentService.findByName(name);
        } else {
            documents = await commentService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments")
        );
    }

    return res.send(documents);
};

// find a single comment with id
exports.findOne = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving comment with id=${req.param.id}`)
        );
    }
};

// update a comment by the id in the comment
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be update"))
    }
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send({ message: "Comment was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update comment with id=${req.params.id}`)
        );
    }
};

// delete a comment with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send({ message: "Comment was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete comment with id=${req.params.id}`)
        );
    }
};

// delete a comment with the specified user id in the request
exports.deleteByUserId = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.deleteByUser(req.params.userid);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send({ message: "Comment was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete comment with user id=${req.params.userid}`)
        );
    }
};

// Delete all comments of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const deleteCount = await commentService.deleteAll();
        return res.send({
            message: `${deleteCount} comments were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all comments")
        );
    }
};

// Retrieve all comment of a user  by user id from the database
exports.findAllCommentByUserId = async (req, res, next) => {
    let documents = [];

    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findAllCommentByUser(req.params.userid);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments by user id")
        );
    }

    return res.send(documents);
};
// Retrieve all comment of a user  by review id from the database
exports.findAllCommentByReviewId = async (req, res, next) => {
    let documents = [];

    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findAllCommentByReview(req.params.reviewid);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments by review id")
        );
    }

    return res.send(documents);
};
// Retrieve all comment of a user  by user id and review id from the database
exports.findAllCommentByUserIdAndReviewId = async (req, res, next) => {
    let documents = [];

    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findAllCommentByUserAndReview(req.params.userid, req.params.reviewid);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments by user id and review id")
        );
    }

    return res.send(documents);
};

