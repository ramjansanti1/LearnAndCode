import express, { Router } from 'express';
import newsController from '../controllers/news.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { RouteConstants } from '../constants/route.constants.js';

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
            .route(RouteConstants.root)
            .get(
                this.authMiddleware.verifyJWT,
                newsController.getNews
            )
            .delete(
                this.authMiddleware.verifyJWT,
                newsController.deleteNewsArticle
            );

        this.router
            .route(RouteConstants.news.date)
            .get(
                this.authMiddleware.verifyJWT,
                newsController.getNewsByDate
            );

        this.router
            .route(RouteConstants.news.save)
            .get(
                this.authMiddleware.verifyJWT,
                newsController.getSavedNewsArticle
            )
            .post(
                this.authMiddleware.verifyJWT,
                newsController.saveNewsArticle
            );

        this.router
            .route(RouteConstants.news.like)
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.likeArticle
            );

        this.router
            .route(RouteConstants.news.dislike)
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.dislikeArticle
            );

        this.router
            .route(RouteConstants.news.report)
            .patch(
                this.authMiddleware.verifyJWT,
                newsController.reportArticle
            );
    }
}