import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import NotificationController from '../controllers/notification.controller.js';

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
            .route('/')
            .get(
                this.authMiddleware.verifyJWT,
                this.notificationController.getNotifications
            )

        this.router
            .route('/config')
            .get(
                this.authMiddleware.verifyJWT,
                this.notificationController.getNotificationConfig
            )
            .post(
                this.authMiddleware.verifyJWT,
                this.notificationController.addNotificationConfig
            )

        this.router
            .route('/addCategory')
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.addCategoryToNotificationConfig
            )

        this.router
            .route('/removeCategory')
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.removeCategoryToNotificationConfig
            )

        this.router
            .route('/addKeyWord')
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.addKeywordToNotificationConfig
            )

        this.router
            .route('/removeKeyword')
            .patch(
                this.authMiddleware.verifyJWT,
                this.notificationController.removeKeywordToNotificationConfig
            )
    }
}