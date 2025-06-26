import NotificationService from "../service/notification.service.js";

export default class NotificationController {
    notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
        this.getNotifications = this.getNotifications.bind(this);
        this.getNotificationConfig = this.getNotificationConfig.bind(this);
        this.addNotificationConfig = this.addNotificationConfig.bind(this);
        this.addCategoryToNotificationConfig = this.addCategoryToNotificationConfig.bind(this);
        this.removeCategoryToNotificationConfig = this.removeCategoryToNotificationConfig.bind(this);
        this.addKeywordToNotificationConfig = this.addKeywordToNotificationConfig.bind(this);
        this.removeKeywordToNotificationConfig = this.removeKeywordToNotificationConfig.bind(this);
    }

    async getNotifications(req: any, res: any) {
        try {
            const fetchedNotificationConfig = await this.notificationService.handleGetNotification(req.user);
            return res
                .status(200)
                .json({ message: "Notification config fetched successfully", data: fetchedNotificationConfig });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error getting notification config", data: error });
        }
    }

    async getNotificationConfig(req: any, res: any) {
        try {
            const fetchedNotificationConfig = await this.notificationService.handleGetNotificationConfig(req.user);
            return res
                .status(200)
                .json({ message: "Notification config fetched successfully", data: fetchedNotificationConfig });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error getting notification config", data: error });
        }
    }

    async addNotificationConfig(req: any, res: any) {
        try {
            const addedNotificationConfig = await this.notificationService.handleAddNotificationConfig(req.body, req.user);
            return res
                .status(200)
                .json({ message: "Notification config fetched successfully", data: addedNotificationConfig });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error adding notification config", data: error });
        }
    }

    async addCategoryToNotificationConfig(req: any, res: any) {
        try {
            const addedCategory = await this.notificationService.handleAddCategoryToNotificationConfig(req.query.category, req.user);
            return res
                .status(200)
                .json({ message: "Category added successfully", data: addedCategory });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error adding category", data: error });
        }
    }

    async removeCategoryToNotificationConfig(req: any, res: any) {
        try {
            const removedCategory = await this.notificationService.handleRemoveCategoryToNotificationConfig(req.query.category, req.user);
            return res
                .status(200)
                .json({ message: "Category removed successfully", data: removedCategory });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error removed category", data: error });
        }
    }

    async addKeywordToNotificationConfig(req: any, res: any) {
        try {
            const addedKeyword = await this.notificationService.handleAddKeywordToNotificationConfig(req.query.keyword, req.user);
            return res
                .status(200)
                .json({ message: "Keyword added successfully", data: addedKeyword });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error adding Keyword", data: error });
        }
    }

    async removeKeywordToNotificationConfig(req: any, res: any) {
        try {
            const removedKeyword = await this.notificationService.handleRemoveKeywordToNotificationConfig(req.query.keyword, req.user);
            return res
                .status(200)
                .json({ message: "Keyword removed successfully", data: removedKeyword });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error removed Keyword", data: error });
        }
    }
}