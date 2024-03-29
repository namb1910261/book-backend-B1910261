const ApiError = require("../api-error");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

// Create and save new book
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the book")
        );
    }
};

// Retrieve all book of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await bookService.findByName(name);
        } else {
            documents = await bookService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the books")
        );
    }

    return res.send(documents);
};

// find a single book with id
exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving book with id=${req.params.id}`)
        );
    }
};

// update a book by the id in the book
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be update"))
    }
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update book with id=${req.params.id}`)
        );
    }
};

// delete a book with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
};

// Find all favorite books of a user
exports.findAllFavorite = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite books")
        );
    }
};

// delete a book with the specified user id in the request
exports.deleteByUserId = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.deleteByUser(req.params.userid);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with user id=${req.params.userid}`)
        );
    }
};

// Delete all books of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deleteCount = await bookService.deleteAll();
        return res.send({
            message: `${deleteCount} books were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all books")
        );
    }
};

// Retrieve all book of a user  by user id from the database
exports.findAllBookByUserId = async (req, res, next) => {
    let documents = [];
    try {
        const bookService = new BookService(MongoDB.client);
        documents = await bookService.findAllBookByUser(req.params.userid);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the books by user id")
        );
    }

    return res.send(documents);
};

