import mongoose from "mongoose";

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

const NotificationConfig = mongoose.model("NotificationConfig", notificationConfigSchema);
export default NotificationConfig;