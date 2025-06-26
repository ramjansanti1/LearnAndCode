import express, { Router } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';

export default class UserRouter {
    router: Router;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            .route('/signup')
            .post(userController.signup);

        this.router
            .route('/login')
            .post(userController.login);

        this.router
            .route('/changepassword')
            .post(
                this.authMiddleware.verifyJWT,
                userController.changePassword
            );
    }
}