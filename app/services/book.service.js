const { ObjectId } = require("mongodb");
class BookService {
    constructor(client) {
        this.Book = client.db().collection("book");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const book = {
            name: payload.name,
            image: payload.image,
            favorite: payload.favorite,
            category_id: payload.category_id,
            user_id: payload.user_id,
        };
        // Remove undefined fields
        // Objects.keys(book).forEach(
        //     (key) => book[key] === undefined && delete book[key]
        // );
        return book;
    }

    async create(payload) {
        const book = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: { favorite: book.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    
    async findFavorite() {
        return await this.find({ favorite: true });
    }
    
    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
    
    async findAllBookByUser(userid) {
        return await this.find({
            user_id: userid ,
        });
    }
}
module.exports = BookService;