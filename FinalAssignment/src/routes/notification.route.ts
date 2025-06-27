import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import NotificationController from '../controllers/notification.controller.js';
import { RouteConstants } from '../constants/route.constants.js';

export default class NotificationRouter {
    router: Router;
    authMiddleware: AuthMiddleware;
    notificationController: NotificationController

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.notificationController = new NotificationController();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            .route(RouteConstants.root)
            .get(
                this.authMiddleware.verifyJWT,
                this.notificationController.getNotifications
            )

        this.router
            .route(RouteConstants.notification.config)
            .get(
                this.authMiddleware.verifyJWT,
                this.notificationController.getNotificationConfig
            )
            .post(
                this.authMiddleware.verifyJWT,
                this.notificationController.addNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.addCategory)
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.addCategoryToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.removeCategory)
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.removeCategoryToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.addKeyWord)
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.addKeywordToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.removeKeyword)
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.removeKeywordToNotificationConfig
            )
    }
}