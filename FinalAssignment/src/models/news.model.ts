import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants";

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        category: {
            type: String,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        blocked: {
            type: Boolean,
            required: true,
            default: false
        },
        reports: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }
        ],
        likes: {
            type: Number
        },
        dislikes: {
            type: Number
        }
    },
    {
        timestamps: true,
        autoIndex: false
    }
);

const News = mongoose.model(MessageConstants.model.news, newsSchema);
export default News;