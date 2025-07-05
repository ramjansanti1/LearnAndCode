import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants.js";

const savedArticleSchema = new mongoose.Schema(
    {
        savedArticleId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String
        }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

const SavedArticle = mongoose.model(MessageConstants.model.savedArticle, savedArticleSchema);
export default SavedArticle;