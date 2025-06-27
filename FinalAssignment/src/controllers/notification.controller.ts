import NotificationService from "../service/notification.service.js";
import { MessageConstants } from "../constants/message.constants.js";

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
                .json({ message: MessageConstants.notification.fetchSuccess, data: fetchedNotificationConfig });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.fetchError, data: error });
        }
    }

    async getNotificationConfig(req: any, res: any) {
        try {
            const fetchedNotificationConfig = await this.notificationService.handleGetNotificationConfig(req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.fetchSuccess, data: fetchedNotificationConfig });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.fetchError, data: error });
        }
    }

    async addNotificationConfig(req: any, res: any) {
        try {
            const addedNotificationConfig = await this.notificationService.handleAddNotificationConfig(req.body, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.addSuccess, data: addedNotificationConfig });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.addError, data: error });
        }
    }

    async addCategoryToNotificationConfig(req: any, res: any) {
        try {
            const addedCategory = await this.notificationService.handleAddCategoryToNotificationConfig(req.query.category, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.categoryAddSuccess, data: addedCategory });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.categoryAddError, data: error });
        }
    }

    async removeCategoryToNotificationConfig(req: any, res: any) {
        try {
            const removedCategory = await this.notificationService.handleRemoveCategoryToNotificationConfig(req.query.category, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.categoryRemoveSuccess, data: removedCategory });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.categoryRemoveError, data: error });
        }
    }

    async addKeywordToNotificationConfig(req: any, res: any) {
        try {
            const addedKeyword = await this.notificationService.handleAddKeywordToNotificationConfig(req.query.keyword, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.keywordAddSuccess, data: addedKeyword });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.keywordAddError, data: error });
        }
    }

    async removeKeywordToNotificationConfig(req: any, res: any) {
        try {
            const removedKeyword = await this.notificationService.handleRemoveKeywordToNotificationConfig(req.query.keyword, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.notification.keywordRemoveSuccess, data: removedKeyword });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.notification.keywordRemoveError, data: error });
        }
    }
}