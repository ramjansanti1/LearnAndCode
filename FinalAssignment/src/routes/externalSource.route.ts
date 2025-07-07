import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import ExternalSourceController from '../controllers/externalSource.controller.js';
import AdminMiddleware from '../middlewares/admin.middleware.js';
import { RouteConstants } from '../constants/route.constants.js';

export default class ExternalSourceRouter {
    router: Router;
    authMiddleware: AuthMiddleware;
    externalSourceController: ExternalSourceController;
    adminMiddleware: AdminMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.externalSourceController = new ExternalSourceController();
        this.adminMiddleware = new AdminMiddleware();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            .route(RouteConstants.root)
            .get(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.externalSourceController.getExternalSource
            )
            .post(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.externalSourceController.addExternalSource
            )
            .patch(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.externalSourceController.updateApiKey
            );
    }
}