import mongoose from "mongoose";

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
        url: {
            type: String,
            required: true
        },
        sentOverMail: {
            type: String,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
        autoIndex: false
    }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;