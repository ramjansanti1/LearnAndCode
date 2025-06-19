import NotificationConfig from "../models/notification.model.js";

export default class NotificationService {
    async handleGetNotificationConfig(user: { [key: string]: any }) {
        const notificationConfig = await NotificationConfig.find({ userId: user._id });
        if (!notificationConfig) {
            throw new Error("No config found");
        }
        return notificationConfig;
    }

    async handleAddNotificationConfig(userPreference: { [key: string]: any }, user: { [key: string]: any }) {
        const notificationConfig = await NotificationConfig.create(
            {
                userId: user._id,
                categoryPreference: userPreference.categoryPreference,
                keywords: userPreference.keywords
            }
        );
        if (!notificationConfig) {
            throw new Error("No config found");
        }
        return notificationConfig;
    }

    async handleAddCategoryToNotificationConfig(category: string, user: { [key: string]: any }) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $addToSet: { categoryPreference: category } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error("No config found");
        }
        return updatedNotificationConfig;
    }

    async handleRemoveCategoryToNotificationConfig(category: string, user: { [key: string]: any }) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $pull: { categoryPreference: category } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error("No config found");
        }
        return updatedNotificationConfig;
    }

    async handleAddKeywordToNotificationConfig(keyword: string, user: { [key: string]: any }) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $addToSet: { keywords: keyword } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error("No config found");
        }
        return updatedNotificationConfig;
    }

    async handleRemoveKeywordToNotificationConfig(keyword: string, user: { [key: string]: any }) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $pull: { keywords: keyword } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error("No config found");
        }
        return updatedNotificationConfig;
    }
}