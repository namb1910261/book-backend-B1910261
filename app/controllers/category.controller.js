const ApiError = require("../api-error");
const CategoryService = require("../services/category.service");
const MongoDB = require("../utils/mongodb.util");

// Create and save new category
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the category")
        );
    }
};

// Retrieve all category of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const categoryService = new CategoryService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await categoryService.findByName(name);
        } else {
            documents = await categoryService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the categorys")
        );
    }

    return res.send(documents);
};

// find a single category with id
exports.findOne = async (req, res, next) => {
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Category not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving category with id=${req.param.id}`)
        );
    }
};

// update a category by the id in the category
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be update"))
    }
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Category not found"));
        }
        return res.send({ message: "Category was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update category with id=${req.params.id}`)
        );
    }
};

// delete a category with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Category not found"));
        }
        return res.send({ message: "Category was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete category with id=${req.params.id}`)
        );
    }
};

// Delete all categorys of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const deleteCount = await categoryService.deleteAll();
        return res.send({
            message: `${deleteCount} categorys were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all categorys")
        );
    }
};

