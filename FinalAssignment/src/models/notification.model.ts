import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants.js";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        articleId: {
            type: String,
            required: true
        },
        notificationArticleId: {
            type: String,
            required: true,
            unique: true
        },
        url: {
            type: String,
            required: true
        },
        sentOverMail: {
            type: Boolean,
            required: true,
            default: false
        },
        title: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

const Notification = mongoose.model(MessageConstants.model.notification, notificationSchema);
export default Notification;