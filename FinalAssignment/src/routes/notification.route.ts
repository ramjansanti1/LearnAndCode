import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import notificationController from '../controllers/notification.controller.js';
import { RouteConstants } from '../constants/route.constants.js';

export default class NotificationRouter {
    router: Router;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            .route(RouteConstants.root)
            .get(
                this.authMiddleware.verifyJWT,
                notificationController.getNotifications
            )

        this.router
            .route(RouteConstants.notification.config)
            .get(
                this.authMiddleware.verifyJWT,
                notificationController.getNotificationConfig
            )
            .post(
                this.authMiddleware.verifyJWT,
                notificationController.addNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.addCategory)
            .patch(
                this.authMiddleware.verifyJWT,
                notificationController.addCategoryToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.removeCategory)
            .patch(
                this.authMiddleware.verifyJWT,
                notificationController.removeCategoryToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.addKeyWord)
            .patch(
                this.authMiddleware.verifyJWT,
                notificationController.addKeywordToNotificationConfig
            )

        this.router
            .route(RouteConstants.notification.removeKeyword)
            .patch(
                this.authMiddleware.verifyJWT,
                notificationController.removeKeywordToNotificationConfig
            )
    }
}