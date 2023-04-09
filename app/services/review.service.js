const { ObjectId } = require("mongodb");
class ReviewService {
    constructor(client) {
        this.Review = client.db().collection("review");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const review = {
            name: payload.name,
            content: payload.content,
            book_id: payload.book_id,
            user_id: payload.user_id,
        };
        // Remove undefined fields
        // Objects.keys(review).forEach(
        //     (key) => review[key] === undefined && delete review[key]
        // );   
        return review;
    }

    async create(payload) {
        const review = this.extractConactData(payload);
        const result = await this.Review.findOneAndUpdate(
            review,
            { $set: {  } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Review.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Review.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Review.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Review.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Review.deleteMany({});
        return result.deletedCount;
    }

    async findAllReviewByUser(userid) {
        return await this.find({
            user_id: userid,
        });
    }
}
module.exports = ReviewService;