const ApiError = require("../api-error");
const ReviewService = require("../services/review.service");
const MongoDB = require("../utils/mongodb.util");

// Create and save new review
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the review")
        );
    }
};

// Retrieve all review of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const reviewService = new ReviewService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await reviewService.findByName(name);
        } else {
            documents = await reviewService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the reviews")
        );
    }

    return res.send(documents);
};

// find a single review with id
exports.findOne = async (req, res, next) => {
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving review with id=${req.params.id}`)
        );
    }
};

// update a review by the id in the review
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be update"))
    }
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.send({ message: "Review was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update review with id=${req.params.id}`)
        );
    }
};

// delete a review with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.send({ message: "Review was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete review with id=${req.params.id}`)
        );
    }
};

// delete a review with the specified user id in the request
exports.deleteByUserId = async (req, res, next) => {
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.deleteByUser(req.params.userid);
        if (!document) {
            return next(new ApiError(404, "Review not found"));
        }
        return res.send({ message: "Review was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete review with user id=${req.params.userid}`)
        );
    }
};

// Delete all reviews of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const deleteCount = await reviewService.deleteAll();
        return res.send({
            message: `${deleteCount} reviews were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all reviews")
        );
    }
};


// Retrieve all Review of a user  by user id from the database
exports.findAllReviewByUserId = async (req, res, next) => {
    let documents = [];

    try {
        const reviewService = new ReviewService(MongoDB.client);
        documents = await reviewService.findAllReviewByUser(req.params.userid);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the Reviews by user id")
        );
    }

    return res.send(documents);
};
