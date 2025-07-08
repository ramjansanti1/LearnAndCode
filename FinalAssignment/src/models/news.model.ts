import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants.js";

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
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
        imageUrl: {
            type: String,
            required: false
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
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

const News = mongoose.model(MessageConstants.model.news, newsSchema);
export default News;