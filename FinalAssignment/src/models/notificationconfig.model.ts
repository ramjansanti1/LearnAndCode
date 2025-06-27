import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants";

const notificationConfigSchema = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        categoryPreference: [
            { type: String }
        ],
        keywords: [
            { type: String }
        ]
    },
    {
        timestamps: true,
        autoIndex: false
    }
);

const NotificationConfig = mongoose.model(MessageConstants.model.notificationConfig, notificationConfigSchema);
export default NotificationConfig;