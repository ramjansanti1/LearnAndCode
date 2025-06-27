import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants";

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

const SavedArticle = mongoose.model(MessageConstants.model.savedArticle, savedArticleSchema);
export default SavedArticle;