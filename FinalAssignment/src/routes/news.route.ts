import express, { Router } from 'express';
import newsController from '../controllers/news.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

export default class NewsRouter {
    router: Router;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.router = express.Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router
            .route('/')
            .get(
                this.authMiddleware.verifyJWT,
                newsController.getNews
            )
            .delete(
                this.authMiddleware.verifyJWT,
                newsController.deleteNewsArticle
            );

        this.router
            .route('/date')
            .get(
                this.authMiddleware.verifyJWT,
                newsController.getNewsByDate
            );

        this.router
            .route('/save')
            .post(
                this.authMiddleware.verifyJWT,
                newsController.saveNewsArticle
            );

        this.router
            .route('/like')
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.likeArticle
            );

        this.router
            .route('/dislike')
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.dislikeArticle
            );

        this.router
            .route('/report')
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.reportArticle
            );
    }
}