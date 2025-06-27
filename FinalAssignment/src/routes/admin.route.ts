import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import AdminController from '../controllers/admin.controller.js';
import ExternalSourceRouter from './externalSource.route.js';
import AdminMiddleware from '../middlewares/admin.middleware.js';
import { RouteConstants } from '../constants/route.constants.js';

export default class AdminRouter {
    router: Router;
    authMiddleware: AuthMiddleware;
    adminController: AdminController;
    externalSourceRouter: ExternalSourceRouter;
    adminMiddleware: AdminMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.adminController = new AdminController();
        this.externalSourceRouter = new ExternalSourceRouter();
        this.adminMiddleware = new AdminMiddleware();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.use(RouteConstants.admin.externalSource, this.externalSourceRouter.router);

        this.router
            .route(RouteConstants.admin.grantadminaccess)
            .patch(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.grantAdminAccess
            );

        this.router
            .route(RouteConstants.admin.revokeadminaccess)
            .patch(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.revokeAdminAccess
            );

        this.router
            .route(RouteConstants.admin.reports)
            .get(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.getReports
            )
            .patch(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.updateArticleStatus
            );

        this.router
            .route(RouteConstants.admin.categories)
            .get(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.getCategories
            )
            .post(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.addCategories
            )
            .patch(
                this.authMiddleware.verifyJWT,
                this.adminMiddleware.checkAdmin,
                this.adminController.updateCategories
            );
    }
}