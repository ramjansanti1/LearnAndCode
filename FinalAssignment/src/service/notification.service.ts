import NotificationConfig from "../models/notificationconfig.model.js";
import News from "../models/news.model.js";
import Notification from "../models/notification.model.js";

export default class NotificationService {
    async startNotificationScheduler(user: { [key: string]: any }) {
        await this.createNotification(user);

        setInterval(async () => {
            await this.createNotification(user);
        }, 3600000);
    }

    private async createNotification(user: { [key: string]: any }) {
        let news: { [key: string]: any }[] = [];
        const notificationConfig = await NotificationConfig.findOne({ userId: user._id });
        if (!notificationConfig) return;
        for (const category of notificationConfig.categoryPreference) {
            const fetchedNews = await News.find({ category, blocked: false }).limit(2);
            news.push(...fetchedNews);
        }
        for (const article of news) {
            await Notification.create({
                userId: user._id,
                articleId: article._id.toString(),
                url: article.url
            });
        }
    }

    async handleGetNotification(user: { [key: string]: any }) {
        const notifications = await Notification.find({ userId: user._id });
        if (!notifications) {
            throw new Error("No config found");
        }
        return notifications;
    }

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