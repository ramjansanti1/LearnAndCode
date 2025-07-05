import NotificationConfig from "../models/notificationconfig.model.js";
import News from "../models/news.model.js";
import Notification from "../models/notification.model.js";
import { MessageConstants } from "../constants/message.constants.js";
import { customObject } from "../types/types.js";

export default class NotificationService {
    async startNotificationScheduler(user: customObject) {
        await this.createNotification(user);
        setInterval(async () => {
            await this.createNotification(user);
        }, 3600000);
    }

    private async createNotification(user: customObject) {
        try {
            let news: customObject[] = [];
            const notificationConfig = await NotificationConfig.findOne({ userId: user._id });
            if (!notificationConfig) return;
            for (const category of notificationConfig.categoryPreference) {
                const fetchedNews = await News.find({ category, blocked: false }).limit(2);
                news.push(...fetchedNews);
            }
            for (const article of news) {
                await Notification.create({
                    userId: user._id,
                    notificationArticleId: `${user._id}-${article._id.toString()}`,
                    url: article.url
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async handleGetNotification(user: customObject) {
        const notifications = await Notification.find({ userId: user._id });
        if (!notifications) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return notifications;
    }

    async handleGetNotificationConfig(user: customObject) {
        const notificationConfig = await NotificationConfig.find({ userId: user._id });
        if (!notificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return notificationConfig;
    }

    async handleAddNotificationConfig(userPreference: customObject, user: customObject) {
        const notificationConfig = await NotificationConfig.create(
            {
                userId: user._id,
                categoryPreference: userPreference.categoryPreference,
                keywords: userPreference.keywords
            }
        );
        if (!notificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return notificationConfig;
    }

    async handleAddCategoryToNotificationConfig(category: string, user: customObject) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $addToSet: { categoryPreference: category } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return updatedNotificationConfig;
    }

    async handleRemoveCategoryToNotificationConfig(category: string, user: customObject) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $pull: { categoryPreference: category } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return updatedNotificationConfig;
    }

    async handleAddKeywordToNotificationConfig(keyword: string, user: customObject) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $addToSet: { keywords: keyword } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return updatedNotificationConfig;
    }

    async handleRemoveKeywordToNotificationConfig(keyword: string, user: customObject) {
        const updatedNotificationConfig = await NotificationConfig.findOneAndUpdate(
            { userId: user._id },
            { $pull: { keywords: keyword } },
            { new: true }
        );
        if (!updatedNotificationConfig) {
            throw new Error(MessageConstants.notification.fetchError);
        }
        return updatedNotificationConfig;
    }
}