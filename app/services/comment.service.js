const { ObjectId } = require("mongodb");
class CommentService {
    constructor(client) {
        this.Comment = client.db().collection("comment");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const comment = {
            user_id: payload.user_id,
            content: payload.content,
            review_id: payload.review_id,
        };
        // Remove undefined fields
        // Objects.keys(comment).forEach(
        //     (key) => comment[key] === undefined && delete comment[key]
        // );
        return comment;
    }

    async create(payload) {
        const comment = this.extractConactData(payload);
        const result = await this.Comment.findOneAndUpdate(
            comment,
            { $set: { } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Comment.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Comment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Comment.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Comment.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    
    async deleteAll() {
        const result = await this.Comment.deleteMany({});
        return result.deletedCount;
    }

    async deleteByUser(userid) {
        const result = await this.Comment.deleteMany({
            user_id: userid,
        });
        return result.deletedCount;
    }
    
    async findAllCommentByUser(userid) {
        return await this.find({
            user_id: userid ,
        });
    }
    async findAllCommentByReview(reviewid) {
        return await this.find({
            review_id: reviewid ,
        });
    }
    async findAllCommentByUserAndReview(userid, reviewid) {
        return await this.find({
            user_id: userid ,
            review_id: reviewid ,
        });
    }
}
module.exports = CommentService;