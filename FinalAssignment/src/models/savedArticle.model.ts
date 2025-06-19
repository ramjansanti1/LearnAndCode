import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema(
    {
        articleId: {
            type: String,
            required: true
        },
        userId: {
            type: String
        }
    },
    {
        timestamps: true,
        autoIndex: false
    }
);

const SavedArticle = mongoose.model("SavedArticle", savedArticleSchema);
export default SavedArticle;